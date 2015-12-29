define(function (require) {

	"use strict";

	var $ = require('jquery');
	var Handlebars = require('handlebars');
	var Marionette = require('backbone.marionette');
	var Template = require('text!./restaurantsList.html');

	var category = "";

	Handlebars.registerHelper('if_eq', function (a, b, opts) {
		if (a == b) {// Or === depending on your needs
			return opts.fn(this);
		} else {
			return opts.inverse(this);
		}
	});

	var RestaurantView = Marionette.ItemView.extend({
		className: 'restaurant-block',
		template: Handlebars.compile(Template),
		templateHelpers: {
			title: function () {
				if (this.category && this.category !== 'food') {
					return this.category;
				} else {
					return this.name;
				}
			},
			newCategory: function () {
				if (category !== this.category) {
					category = this.category;
					return true;
				}
			},
			sentiment: function () {
				var data = this.model.toJSON();
				var keys = ['excellent', 'good', 'average', 'poor', 'terrible'];
				var highest = '', highestValue = 0;
				$.each(keys, function (i, key) {
					if (data[key] > highestValue) {

						highest = key;
						highestValue = data[key];
					}
				});
				console.log(data.eatery_name, highest);
				return highest;
			},
			isFood: function () {
				if (this.model.get('category') === 'food') { return true; }
			}
		},
		events: {
			'mouseenter .restaurant-text-content': 'highlight',
			'mouseleave .restaurant-text-content': 'unhighlight',
			'click .restaurant-text-content': 'show'
		},
		highlight: function (e) {
			$(this.el).addClass('active');
		},
		unhighlight: function (e) {
			$(this.el).removeClass('active');
		},
		show: function (e) {
			e.preventDefault();
			var restaurantName = this.model.get('__eatery_id');
			// var restaurantId= this.model.get('eatery_id');
			console.log(this.model.toJSON());
			this.triggerMethod('show:restaurant', restaurantName, this.model.toJSON());
		}
	});

	var RestaurantsListView = Marionette.CollectionView.extend({
		className: 'restaurants-list-wrapper',
		childView: RestaurantView,
		updateData: function (newCollection) {
			this.collection = newCollection;
			this.render();
		}
	});

	return RestaurantsListView;
});