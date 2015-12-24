define(function (require) {

	"use strict";

	var $= require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Handlebars = require('handlebars');
	var Marionette = require('backbone.marionette');
	var Template = require('text!./applicationView.html');

	var FooterView = require('./footer/i-footer');
	var FacetsView = require('./facets/i-facets');
	var RestaurantsListView = require('./restaurants/c-restaurantsList');
	var MapView = require('./map/i-map');

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

	var ApplicationView = Marionette.LayoutView.extend({
		id: 'applicationPage',
		template: Handlebars.compile(Template),
		regions: {
			'facets': '.facets',
			'restaurantsList': '.restaurantsList',
			'map': '.map',
			'footer': 'footer'
		},
		initialize: function (opts) {
			var self = this;

			this.model = opts.user;
			this.restaurantData = opts.restaurants;
			this.lat = opts.lat;
			this.lng = opts.lng;

			this.footerView = new FooterView();
			this.facetsView = new FacetsView();

			this.restaurantsListView = new RestaurantsListView({ collection: this.restaurantData });
			this.mapView = new MapView({ collection: self.restaurantData, lat: this.lat, lng: this.lng });
		},
		templateHelpers: {
			isLoggedIn: function () {
				return this.model.isAuthorized();
			},
		},
		childEvents: {
			'location:changed': 'updateData'
		},
		updateData: function(childView, lat, lng) {
			var self= this;
			this.restaurantData.fetch({ method: 'POST', data: { lat: lat, lng: lng } }).done(function () {
				self.mapView.showMarkers(self.restaurantData.toJSON());
			});
		},
		onShow: function () {
			var self = this;
			this.showChildView('footer', this.footerView);
			this.showChildView('facets', this.facetsView);
			this.restaurantData.fetch({ method: 'POST', data: { lat: self.lat, lng: self.lng } }).done(function () {
				self.showChildView('restaurantsList', self.restaurantsListView);
				self.showChildView('map', self.mapView);
			});

			if(this.model.isAuthorized()) {
			 	$('.user-profile-dropdown-button').dropdown({
					 constrain_width: false,
					 alignment: 'center'
				 });
			}
		}
	});

	return ApplicationView;
});