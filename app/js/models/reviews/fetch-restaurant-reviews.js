define(function (require) {
	'use strict';

	var Backbone = require('backbone');

	var Review = Backbone.Model.extend();
	var Reviews = Backbone.Collection.extend({
		model: Review,
		url: "http://52.76.176.188:8000/fetchreview",
		parse: function (response) {
			console.log(response);
			if(response.error) {return [];}
			return response.result;
		}
	});

	return Reviews;
});