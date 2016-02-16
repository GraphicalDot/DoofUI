define(function (require) {
	'use strict';

	var Backbone = require('backbone');

	var UserProfile = Backbone.Model.extend({
		url: "http://52.76.176.188:8000/userprofile",
		parse: function (response) {
			if (response.error) {
				throw new Error("cannot fetch user profile review");
				return [];
			}
			return response.result;
		}
	});

	return UserProfile;
});