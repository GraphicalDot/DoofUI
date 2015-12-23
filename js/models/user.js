define(function(require) {

	"use strict";

	var Backbone = require('backbone');

	var FB= require('facebook');

	var async= require('async');
	var Promise= require('es6Promises').Promise;

	var self= '';

	var User= Backbone.Model.extend({
		facebookAuthResponse: '',
		defaults: {id: null, third_party_id: null, name: null, email: null, image: null, status: 0},
		initialize: function(opts) {
			self= this;
			this.facebookAuthResponse= opts.facebookAuthResponse;
		},
		fetchUserData: function() {
			var promise= new Promise(function(resolve, reject) {
				if(self.facebookAuthResponse && self.facebookAuthResponse.status=== "connected") {
					async.waterfall([self.getUserData, self.saveSession], function(err, result) {
						if(err) {console.log('err'); reject()};
						resolve();
					});
				} else {
					console.log("Facebook user not logged in or authorized");
					reject();
				}
			});
			return promise;
		},
		isAuthorized: function() {
			return Boolean(this.get("third_party_id"));
		},
		getUserData: function(callback) {
			FB.api('/me?fields=third_party_id,email,name,picture', function (response) {
				if(!response || response.error) {
					callback(true, response.error)
				} else {
					callback(null, response);
				}
			});
		},
		saveSession: function(user, callback) {
			if(user['third_party_id']) {
				self.set({
					id: user['id'],
					third_party_id: user['third_party_id'],
					name: user['name'],
					email: user['email'],
					picture: user['picture'],
					status: "1"
				}, {silent: true});
				callback(null);
			} else {
				callback(true, "Third party check failed!");
			}
		},
		login: function() {
			var promise= new Promise(function(resolve, reject) {
				FB.login(function(response) {
					if(response.authResponse) {
						async.waterfall([self.getUserData, self.saveSession], function(err, result) {
							if(err) {console.log('err'); reject()};
							resolve();
						});
					} else {
						console.log("User cancelled login or did not fully authorize");
						reject();
					}
				}, {scope: 'email'});
			});
			return promise;
		},
		logout: function() {
			var promise= new Promise(function(resolve, reject) {
				FB.logout(function() {
					self.clear();
					resolve();
				});
			});
			return promise;
		}
	});

	return User;
});