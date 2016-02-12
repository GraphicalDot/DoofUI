define(function (require) {

	"use strict";

	var Backbone = require('backbone');
	var FB = require('facebook');

	var async = require('async');
	var Promise = require('es6promise').Promise;

	var Radio= require('radio');

	var self;

    // This model handles facebook auth and everything.
	var User = Backbone.Model.extend({
		defaults: { id: null, third_party_id: null, name: null, email: null, image: null, status: 0 },
		initialize: function (opts) {
			self = this;
			FB.init({
				appId: "202326320112782",
				// appId: "1605945752959547",
				version: "v2.5",
				status: true
			});

			var userChannel = Radio.channel('user');

			FB.getLoginStatus(function (response) {
				self.facebookResponse = response;
				self.fetchData().then(function(success) {
					self.sendUserData();
					userChannel.trigger('logged_in');
				}, function(error) {});
			});
		},
		sendUserData: function() {
			var UserFeed= Backbone.Model.extend({
				url: window.usersdetails
			});

			var userFeed= new UserFeed();

			userFeed.fetch({method: 'POST', data: {email: self.get('email'), fb_id: self.get('id'), picture: self.get('picture').data.url, name: self.get('name')}}).then(function(response) {
				if(response.error) {console.log('Error in sending data')};
			});
		},
		fetchData: function () {
			var promise = new Promise(function (resolve, reject) {
				if (self.facebookResponse.status === "connected") {
					async.waterfall([self.getUserData, self.saveSession], function (err, result) {
						if (err) { console.log('err'); reject() };
						resolve();
					});
				} else {
					reject();
				}
			});
			return promise;
		},
		isAuthorized: function () {
			return Boolean(this.get("third_party_id"));
		},
		getUserData: function (callback) {
			FB.api('/me?fields=third_party_id,email,name,picture', function (response) {
				if (!response || response.error) {
					callback(true, response.error)
				} else {
					callback(null, response);
				}
			});
		},
		saveSession: function (user, callback) {
			if (user['third_party_id']) {
				self.set({
					id: user['id'],
					third_party_id: user['third_party_id'],
					name: user['name'],
					email: user['email'],
					picture: user['picture'],
					status: "1"
				}, { silent: true });
				callback(null);
			} else {
				callback(true, "Third party check failed!");
			}
		},
		login: function () {
			var promise = new Promise(function (resolve, reject) {
				FB.login(function (response) {
					if (response.authResponse) {
						async.waterfall([self.getUserData, self.saveSession], function (err, result) {
							if (err) { console.log('err'); reject() };
							self.sendUserData();
							resolve();
						});
					} else {
						console.log("User cancelled login or did not fully authorize");
						reject();
					}
				}, { scope: 'email' });
			});
			return promise;
		},
		logout: function () {
			var promise = new Promise(function (resolve, reject) {
				FB.logout(function () {
					self.clear();
					resolve();
				});
			});
			return promise;
		}
	});

	return User;
});