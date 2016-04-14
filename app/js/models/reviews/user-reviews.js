define(function (require) {
	'use strict';

	var Backbone = require('backbone');

	var UserProfile = Backbone.Model.extend({
		url: "http://52.76.176.188:8000/userprofile",
		parse: function (response) {
			if(response.result) {
				return response.result;
			} else {
				return [];
			}
		}
	});

	return UserProfile;
});