define(function (require) {

	"use strict";

	var _= require('underscore');
	var Handlebars = require('handlebars');
	var Marionette = require('marionette');
	var Template = require('text!./restaurant.html');

   	Handlebars.registerHelper('if_eq', function (a, b, opts) {
		if (a == b) {// Or === depending on your needs
			return opts.fn(this);
		} else {
			return opts.inverse(this);
		}
	});

	var RestaurantView = Marionette.ItemView.extend({
		className: 'restaurant-list-item',
		template: Handlebars.compile(Template),
		templateHelpers: {
			isFood: function() {
				return this.model.get('category')=== 'food';
			},
			sentiment: function() {
				var data= this.model.toJSON();
				var keys = ['excellent', 'good', 'average', 'poor', 'terrible'];
				var highest = '', highestValue = 0;
				_.each(keys, function(key, i) {
					if (data[key] > highestValue) {
						highest = key;
						highestValue = data[key];
					}
				});
				return highest;
			}
		}
	});

	var RestaurantsListView = Marionette.CollectionView.extend({
		id: 'restaurants-list-view',
		childView: RestaurantView,
	});

	return RestaurantsListView;
});