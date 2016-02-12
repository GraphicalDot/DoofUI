define(function (require) {
	"use strict";

	var Backbone = require('backbone');
	var Promise = require('es6promise').Promise;
	var FB = require('facebook');

	var UserDetailModel = require('./userdetails');

	var UserModel = Backbone.Model.extend({
		defaults: { id: null, third_party_id: null, name: null, email: null, image: null, status: 0 },
		init: function () {
			var promise = new Promise(function (resolve) {
				FB.init({
					appId: "202326320112782",
					// appId: "1605945752959547",
					version: "v2.5",
					status: true
				});
				resolve();
			});
			return promise;
		},
		checkLogin: function () {
			var self = this;
			var promise = new Promise(function (resolve) {
				FB.getLoginStatus(function (response) {
					if (response.status === "connected") {
						self.set({ status: response.status }, { silent: true });
					}
					resolve();
				});
			});
			return promise;
		},
		fetchInfo: function () {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				if (self.get('status')) {
					FB.api('/me?fields=third_party_id,email,name,picture', function (response) {
						if (!response, response.error) {
							reject("FacebookUser model, fetchInfo -> Error occured");
						}
						self.set({
							id: response['id'],
							third_party_id: response['third_party_id'],
							name: response['name'],
							email: response['email'],
							image: response['picture'].data.url
						}, { silent: true });
						resolve();
					});
				}
			});
			return promise;
		},
		sendUserData: function () {
			var userDetails = new UserDetailModel();
			userDetails.fetch({ method: 'POST', data: { email: this.get('email'), fb_id: this.get('id'), picture: this.get('picture'), name: this.get('name') } });
		},
		isAuthorized: function () {
			return Boolean(this.get("third_party_id"));
		},
		login: function () {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				FB.login(function (response) {
					if (response.authResponse) {
						self.fetchInfo().then(function () {
							self.sendUserData();
							resolve();
						}, function (err) {
							reject();
						});
					} else {
						reject();
					}
				}, { scope: 'email' });
			});
			return promise;
		},
		logout: function () {
			var promise = new Promise(function (resolve) {
				FB.logout(function () {
					self.clear();
					resolve();
				});
			});
			return promise;
		}
	});

	return UserModel;
});