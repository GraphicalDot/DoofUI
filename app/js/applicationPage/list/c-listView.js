define(function(require) {
	'use strict';

	var Marionette= require('marionette');
	var Handlebars= require('handlebars');
	var Template= require('text!./list.html');

	var RestaurantView= Marionette.ItemView.extend({
		className: 'restaurant-item',
		template: Handlebars.compile(Template)
	});

	var EmptyRestaurantView= Marionette.ItemView.extend({
		initialize: function() {
			this.template= Handlebars.compile('No Restaurants Present Yet..');
		}
	});

	var RestaurantListView= Marionette.CollectionView.extend({
		id: 'restaurantList',
		emptyView: EmptyRestaurantView,
		childView: RestaurantView
	});
	return RestaurantListView;

});