// This control the Router and controller of application.
define(function (require) {
	"use strict";

	var $ = require('jquery');
	var Marionette = require('marionette');

	var Router = Marionette.AppRouter.extend({
		initialize: function (opts) {
			this.region = opts.region;
			this.user = opts.user;
		},
		routes: {
			"": "landingPage",
			"application": "application"
		},
		landingPage: function () {
			var self = this;
			var LandingPage = require('./landingPage/i-landingPage');
			var landingPage = new LandingPage({ user: this.user });
			this.region.show(landingPage);
			landingPage.on("goToApplication", function (location, nearEateries) {
				self.application(location, nearEateries);
			});
			$('.loader').velocity("fadeOut", 1000);
		},
		application: function (location, nearEateries) {
			var ApplicationPage = require('./applicationPage/l-applicationPage');
			var applicationPage = new ApplicationPage({ user: this.user, position: location, collection: nearEateries });
			this.region.show(applicationPage);
			$('.loader').velocity("fadeOut", 1000);
		}
	});

	return Router;
});