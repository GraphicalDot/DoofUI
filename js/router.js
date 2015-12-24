define(function (require) {

	"use strict";

	var Marionette = require('backbone.marionette');

	var self;

	var Router = Marionette.AppRouter.extend({
		initialize: function (opts) {
			self = this;
			this.doofRegion = opts.doofRegion;

			this.user = opts.user;
		},
		appRoutes: {
			"": "landingPage",
			"application": "application"
		},
		controller: {
			"landingPage": function () {
				var LandingPage = require('./landingPage/i-landingPage');
				var landingPage = new LandingPage({ user: self.user });
				self.doofRegion.show(landingPage);
			},
			"application": function () {
				var Restaurants = require('./models/restaurants');
				var ApplicationView = require('./application/l-applicationView');

				// geolocation error case.
				function handleLocationError(browserHasGeolocation) {
					//saket lat lng if nothing is found
					var pos = { lat: 28.5192, lng: 77.2130 }
					var restaurants = new Restaurants({ lat: pos.lat, lng: pos.lng });
					var applicationView = new ApplicationView({ user: self.user, lat: pos.lat, lng: pos.lng, restaurants: restaurants });
					self.doofRegion.show(applicationView);
				}

				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function (position) {
						var pos = { lat: position.coords.latitude, lng: position.coords.longitude };
						var restaurants = new Restaurants({ lat: pos.lat, lng: pos.lng });
						var applicationView = new ApplicationView({ user: self.user, lat: pos.lat, lng: pos.lng, restaurants: restaurants });
						self.doofRegion.show(applicationView);
					}, function () {
						handleLocationError(true);
					});
				} else {
					// Browser doesnt support Geolocation
					handleLocationError(false);
				}
			}
		}
	});

	return Router;
});