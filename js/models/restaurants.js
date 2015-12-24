define(function(require) {

	"use strict";

	var _= require('underscore');
	var Backbone= require('backbone');

	var rad= function(x) {
		return x * Math.PI / 180;
	};

	function calculateDistance(lat1, lon1, lat2, lon2) {
		var R = 6378137; // Earth’s mean radius in meter
		var dLat = rad(lat2 - lat1);
		var dLong = rad(lon2 - lon1);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
			Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return (d/1000).toFixed(); // returns the distance in kiloometer
	}

	var Restaurant = Backbone.Model.extend({
		defaults: { position: 0 }
	});

	return Backbone.Collection.extend({
		url: window.get_trending,
		parse: function (response) {
			var self = this;
			if (response.success) {
				var responseResult = response.result;
				var output = [];

				_.each(["food", "ambience", "cost", "service"], function (category) {
					var categoryResult = responseResult[category];

					_.each(categoryResult, function (result, i) {
						result.category = category;
						result.position = i + 1;
						result.distance = calculateDistance(self.models[0].attributes.lat, self.models[0].attributes.lng, result.location.lat, result.location.lon)
						output.push(result);
					});
				});

				return output;
			}
		},
		model: Restaurant
	});
});