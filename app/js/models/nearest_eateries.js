define(function(require) {
	'use strict';

	var Backbone= require('backbone');

	var Eatery= Backbone.Model.extend();

	var NearestEateries= Backbone.Collection.extend({
		model: Eatery,
		url: "http://52.76.176.188:8000/nearesteateries",
		parse: function(response) {
			if(response.error) {return [];}
			return response.result;
		}
	});
	return NearestEateries;
});