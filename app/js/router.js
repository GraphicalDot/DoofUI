define(function (require) {
	"use strict";

	var $ = require('jquery');
	var Marionette = require('marionette');

	var GoogleService = require('./services/google-service');
	var RestaurantService = require('./services/restaurant-service');

	var Router = Marionette.AppRouter.extend({
		initialize: function (opts) {
			this.region = opts.region;
			this.user = opts.user;

			this.googleService = new GoogleService();
			this.restaurantService = new RestaurantService();
		},
		routes: {
			"": "home"
		},
		home: function () {
			var fbUser = this.user;
			if (fbUser.isAuthorized()) {
				this.application();
			} else {
				this.landingPage();
			}
		},
		/**
		 * Loads Landing Page
		 */
		landingPage: function () {
			var self = this;
			var LandingPage = require('./landingPage/i-landingPage');
			var landingPage = new LandingPage({ googleService: this.googleService, restaurantService: this.restaurantService });
			landingPage.on('goToApplication', function (position, eateries, eateryCategory) {
				self.application(position, eateries, eateryCategory);
			});
			this.region.show(landingPage);
			this.hideLoader();
		},
		/**
		 * Loads Application View.
		 * @params position -> {latLng: {lat: startingLat, lng: startingLng}, place: 'New Delhi'}
		 * @params eateries -> List of eateries to show [Optional]
		 * @params eateryCategory -> trending / nearby [Type of eateries in one params ]
		 */
		application: function (position, eateries, eateryCategory) {
			var ApplicationPage = require('./applicationPage/l-applicationPage');
			var applicationPage = new ApplicationPage({ user: this.user, position: position, eateries: eateries, category: eateryCategory, dataService: this.dataService, googleService: this.googleService });
			this.region.show(applicationPage);
			this.hideLoader();
		},
		hideLoader: function () {
			require(['velocity'], function () {
				$('.loader').velocity("fadeOut", 1000);
			});
		}
	});

	return Router;
});