define(function (require) {
	"use strict";

	var $ = require('jquery');
	var Backbone = require('backbone');
	var FB = '';
	var Promise = require('es6promise').Promise;

	var UserModel = Backbone.Model.extend({
		defaults: { id: null, third_party_id: null, name: null, email: null, image: null, status: 0 },
		// Initialize FB SDK
		init: function () {
			var promise = new Promise(function (resolve, reject) {
				require(['facebook'], function (facebook) {
					FB = facebook;
					FB.init({
						appId: "202326320112782", //development key
						// appId: "1605945752959547", //product key
						version: "v2.5"
					});
					resolve();
				}, function (err) {
					var failedId = err.requireModules && err.requireModules[0];
					if (failedId === "facebook") {
						reject("Could not connect to Facebook..");
					}
				});
			});
			return promise;
		},
		// Check if User is Logged In using FB method. Update status accordingly.
		checkLogin: function () {
			var self = this;
			var promise = new Promise(function (resolve) {
				FB.getLoginStatus(function (response) {
					if (response.status === "connected") {
						self.set({ status: response.status }, { silent: true });
					}
					resolve();
				}, true);
			});
			return promise;
		},
		// Fetch userinfo if user is logged in.. otherwise do nothing..
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
				} else {
					resolve();
				}
			});
			return promise;
		},
		// Send User Data for analytics.
		sendUserData: function () {
			if (this.get('status')) {
				$.ajax({
					url: "http://52.76.176.188:8000/usersdetails",
					dataType: 'json',
					method: 'POST',
					data: { email: this.get('email'), fb_id: this.get('id'), picture: this.get('image'), name: this.get('name') },
					success: function () {
						console.log('current user information successfully sent');
					},
					error: function () {
						console.log('userdetails api not working..');
					}
				});
			}
		},
		// This method checks if current user is authorized [return true, false]
		isAuthorized: function () {
			return Boolean(this.get("third_party_id"));
		},
		// Facebook method for logging in
		login: function () {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				FB.login(function (response) {
					if (response.authResponse) {
						self.set({ status: response.status }, { silent: true });
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
		// Facebook method for logging out
		logout: function () {
			var self = this;
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