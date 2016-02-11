define(function (require) {
	'use strict';

	var Backbone = require('backbone');
	var Promise = require('es6Promises').Promise;
	var FB = require('facebook');

	var UserModel = Backbone.Model.extend({
		defaults: { id: null, third_party_id: null, name: null, email: null, image: null, status: 0 },
		// Facebook initialize call.
		init: function () {
			var promise = new Promise(function (resolve) {
				FB.init({
					appId: '202326320112782',
					version: 'v2.5',
					status: true
				});
				resolve();
			});
			return promise;
		},
		// Facebook method to get Login status.
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
							picture: response['picture']
						}, { silent: true });
						resolve();
					});
				} else {
					resolve();
				}
			});
			return promise;
		},
	});

	return UserModel;
});