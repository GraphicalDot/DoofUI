define(function(require) {

	"use strict";

	var _= require('underscore');
	var Backbone= require('backbone');
	var Handlebars= require('handlebars');
	var Marionette= require('backbone.marionette');
	var Template= require('text!./applicationView.html');

	var FooterView= require('./footer/i-footer');
	var FacetsView= require('./facets/i-facets');
	var RestaurantsListView= require('./restaurants/c-restaurantsList');
	var MapView= require('./map/i-map');

	Backbone.Marionette.LayoutView.prototype.mixinTemplateHelpers = function (target) {
		var self = this;
		var templateHelpers = Marionette.getOption(self, "templateHelpers");
		var result = {};

		target = target || {};

		if (_.isFunction(templateHelpers)) {
			templateHelpers = templateHelpers.call(self);
		}

		// This _.each block is what we're adding
		_.each(templateHelpers, function (helper, index) {
			if (_.isFunction(helper)) {
				result[index] = helper.call(self);
			} else {
				result[index] = helper;
			}
		});

		return _.extend(target, result);
	};

	var ApplicationView= Marionette.LayoutView.extend({
		id: 'applicationPage',
		template: Handlebars.compile(Template),
		regions: {
			'facets': '.facets',
			'restaurantsList': '.restaurantsList',
			'map': '.map',
			'footer': 'footer'
		},
		initialize: function(opts) {

			this.model= opts.user;
			this.footerView= new FooterView();
			this.facetsView= new FacetsView();

			this.restaurantsListView= new RestaurantsListView();
			this.mapView= new MapView();
		},
		templateHelpers: {
			isLoggedIn: function() {
				return this.model.isAuthorized();
			},
		},
		onShow: function() {
			this.showChildView('footer', this.footerView);
			this.showChildView('facets', this.facetsView);
			this.showChildView('restaurantsList', this.restaurantsListView);
			this.showChildView('map', this.mapView);
		}
	});

	return ApplicationView;
});