define(function (require) {
	'use strict';

	var Backbone = require('backbone');

	var Search = Backbone.Model.extend();

	return Backbone.Collection.extend({
		url: "http://52.76.176.188:8000/textsearch",
		model: Search,
		parse: function (response) {
			// if(response.error) {return [];};
			return response.result;
		}
	});
});