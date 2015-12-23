define(function(require) {

	"use strict";

	var Handlebars= require('handlebars');
	var Marionette= require('backbone.marionette');
	var Template= require('text!./applicationView.html');

	var HeaderView= require('./header/i-header');
	var FooterView= require('./footer/i-footer');
	var FacetsView= require('./facets/i-facets');
	var RestaurantsListView= require('./restaurants/c-restaurantsList');
	var MapView= require('./map/i-map');

	var Gmap= require('gmaps');

	var ApplicationView= Marionette.ItemView.extend({
		template: Handlebars.compile(Template),
		regions: {
			'header': 'header',
			'facets': '.facets',
			'restaurantsList': '.restaurantsList',
			'map': '.map',
			'footer': 'footer'
		},
		initialize: function() {
			this.headerView= new HeaderView();
			this.footerView= new FooterView();
			this.facetsView= new FacetsView();

			this.restaurantsListView= new RestaurantsListView();
			this.mapView= new MapView();
		}
	});

	return ApplicationView;
});