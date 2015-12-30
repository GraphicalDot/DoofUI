define(function (require) {
	'use strict';

	var Backbone = require('backbone');
	var Search = Backbone.Model.extend();

	return Backbone.Collection.extend({
		url: window.textsearch,
		model: Search,
		parse: function(response) {
			return response.result;
		}
	});
});