define(function (require) {

	"use strict";

	var $ = require('jquery');
	var _ = require('underscore');
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
		attributes: function () {
			return {
				'eatery-id': this.model.get('__eatery_id')
			};
		},
		events: {
			'mouseenter .restaurant-list': 'highlight',
			'mouseleave .restaurant-list': 'unhighlight',
			'click .restaurant-list': 'show'
		},
		highlight: function () {
			$(this.el).addClass('active');
			this.triggerMethod('highlightMarker:restaurant', this.model.get('__eatery_id'));
		},
		unhighlight: function () {
			$(this.el).removeClass('active');
			this.triggerMethod('unhighlightMarker:restaurant', this.model.get('__eatery_id'));
		},
		show: function () {
			this.triggerMethod('show:restaurant', this.model.get('__eatery_id'), this.model.toJSON());
		},
		templateHelpers: {
			isFood: function () {
				return this.model.get('category') === 'food';
			},
			sentiment: function () {
				var data = this.model.toJSON();
				var keys = ['excellent', 'good', 'average', 'poor', 'terrible'];
				var highest = '', highestValue = 0;
				_.each(keys, function (key, i) {
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