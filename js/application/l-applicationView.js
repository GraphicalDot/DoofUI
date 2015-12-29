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
			'footer': 'footer',
			'single': '.single-content'
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
			this.mapView = new MapView({ collection: this.restaurantData, lat: this.lat, lng: this.lng });
		},
		templateHelpers: {
			isLoggedIn: function () {
				return this.model.isAuthorized();
			},
		},
		childEvents: {
			"show:restaurants": "updateData",
			"show:restaurant": "showRestaurant",
			'location:changed': 'updateData'
		},
		updateData: function(childView, newData) {
			if (newData) {
				this.restaurantsListView.updateData(newData);
			} else {
				this.restaurantsListView.updateData(this.collection);
			}
		},
		showRestaurant: function (view, restaurant_id, restaurant_details, restaurant_data) {
			var self = this;
			var Restaurant = require('./../models/restaurant');
			var SingleView= require('./singleView/i-singleView');

			if(restaurant_data) {
				this.singleView = new SingleView({ model: restaurant_data, restaurant_info: {eatery_details: {}}});
				self.showChildView('single', self.singleView);
			} else {
				var restaurant = new Restaurant();
				this.singleView = new SingleView({ model: restaurant, restaurant_info: restaurant_details });
				restaurant.fetch({ method: "POST", data: { "__eatery_id": restaurant_id } }).then(function () {
					// self.singleView.render();
					// var divContent= self.singleView.$el[0];
					// self.mapView.showMarkerDetail(divContent, restaurant_id);
					// self.singleView.destroy();
					self.showChildView('single', self.singleView);
				});
			}
		},
		onShow: function () {
			var self = this;
			this.showChildView('footer', this.footerView);
			this.showChildView('facets', this.facetsView);

			self.lat= 28.5538388889;
			self.lng= 77.1945111111;

			this.restaurantData.fetch({ method: 'POST', data: { latitude: self.lat, longitude: self.lng } }).done(function () {
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