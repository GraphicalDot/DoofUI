define(function (require) {
	"use strict";

	var _ = require('underscore');
	var Backbone = require('backbone');

	var TrendingItem = Backbone.Model.extend();
	var TrendingItems = Backbone.Collection.extend({
		model: TrendingItem,
		url: "http://52.76.176.188:8000/gettrending",
		parse: function (response) {
			if (response.error) { return [] };

			var output = [];
			_.each(["food", "ambience", "cost", "service"], function (category) {
				var categoryResult = response.result[category];
				_.each(categoryResult, function (result, i) {
					result.category = category;
					output.push(result);
				});
			});
			return output;
		}
	});

	return TrendingItems;
});