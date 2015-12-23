define(function(require) {

	"use strict";

	var Handlebars= require('handlebars');
	var Marionette= require('backbone.marionette');
	var Template= require('text!./restaurantsList.html');

	var RestaurantsListView= Marionette.ItemView.extend({
		template: Handlebars.compile(Template)
	});

	return  RestaurantsListView;
})