define(function(require) {
	"use strict";

	var Backbone= require('backbone');

	var Feedback= Backbone.Model.extend({
		url: window.usersfeedback
	});
});