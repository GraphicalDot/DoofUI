define(function (require) {
	'use strict';

	var Backbone = require('backbone');

	var WriteReview = Backbone.Model.extend({
		url: "http://52.76.176.188:8000/writereview"
	});

	return WriteReview;
});