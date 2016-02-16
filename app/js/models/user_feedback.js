define(function (require) {
	'use strict';

	var Backbone = require('backbone');

	var UserFeedback = Backbone.Model.extend({
		url: "http://52.76.176.188:8000/usersfeedback"
	});

	return UserFeedback;
})