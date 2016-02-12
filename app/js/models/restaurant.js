define(function (require) {

	"use strict";

	var Backbone = require('backbone');

	return Backbone.Model.extend({
		url: window.geteatery,
		parse: function (response) {
			return response.result;
		}
	});
});