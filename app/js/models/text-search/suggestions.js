define(function (require) {
	'use strict';

	var Backbone = require('backbone');

	var SuggestionsModel = Backbone.Model.extend({
		url: "http://52.76.176.188:8000/suggestions",
		parse: function (response) {
			return {
				foodSuggestions: response.result[0].suggestions,
				restaurantSuggestions: response.result[1].suggestions,
				cuisineSuggestions: response.result[2].suggestions,
			}
		}
	});

	return SuggestionsModel;
});