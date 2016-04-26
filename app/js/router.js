define(function (require) {
	"use strict";

	var $ = require('jquery');
	var Marionette = require('marionette');

	var LandingPage = require('./landingPage/i-landingPage');
	var ApplicationPage = require('./applicationPage/l-applicationPage');

	var DataService = require('./services/data-service');
	var GoogleService= require('./services/google-services');

	var Router = Marionette.AppRouter.extend({
		initialize: function (opts) {
			this.region = opts.region;
			this.user = opts.user;
			
			this.dataService = new DataService();
			this.googleService= new GoogleService();

			require(['velocity'], function () {
				$('.loader').velocity("fadeOut", 1000);
			});
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
			var landingPage = new LandingPage({ user: this.user, dataService: this.dataService, googleService: this.googleService });
			landingPage.on('goToApplication', function (position, eateries, eateryCategory) {
				self.application(position, eateries, eateryCategory);
			});
			this.region.show(landingPage);
		},
		/**
		 * Loads Application View.
		 * @params position -> {latLng: {lat: startingLat, lng: startingLng}, place: 'New Delhi'}
		 * @params eateries -> List of eateries to show [Optional]
		 * @params eateryCategory -> trending / nearby [Type of eateries in one params ]
		 */
		application: function (position, eateries, eateryCategory) {
			var applicationPage = new ApplicationPage({ user: this.user, position: position, eateries: eateries, category: eateryCategory, dataService: this.dataService, googleService: this.googleService });
			this.region.show(applicationPage);
		}
	});

	return Router;
});