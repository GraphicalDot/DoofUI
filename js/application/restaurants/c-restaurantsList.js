define(function (require) {

	"use strict";

	var Handlebars = require('handlebars');
	var Marionette = require('backbone.marionette');
	var Template = require('text!./restaurantsList.html');

	var category= "";
	var RestaurantView= Marionette.ItemView.extend({
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
			newCategory: function() {
				if(category !== this.category) {
					category= this.category;
					return true;
				}
			}
		},
	});

	var RestaurantsListView = Marionette.CollectionView.extend({
		className: 'restaurants-list-wrapper',
		childView: RestaurantView
	});

	return RestaurantsListView;
});