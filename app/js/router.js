define(function (require) {
	"use strict";

	var $ = require('jquery');
	var Marionette = require('marionette');

	var LandingPage = require('./landingPage/i-landingPage');
	var ApplicationPage = require('./applicationPage/l-applicationPage');

	var Router = Marionette.AppRouter.extend({
		initialize: function (opts) {
			this.region = opts.region;
			this.user = opts.user;
			require(['velocity'], function () {
				$('.loader').velocity("fadeOut", 1000);
			});
		},
		routes: {
			"": "home"
		},
		home: function() {
			var fbUser= this.user;
			if(fbUser.isAuthorized()) {
				this.application();
			} else {
				this.landingPage();
			}
		},
		landingPage: function () {
			var self= this;
			var landingPage = new LandingPage({ user: this.user });
			landingPage.on('goToApplication', function() {
				self.application();
			});
			this.region.show(landingPage);
		},
		// Application Route.. position: {lat: x, lng: y, address: z}
		application: function (position) {
			var applicationPage = new ApplicationPage({ user: this.user, position: position });
			this.region.show(applicationPage);
		}
	});

	return Router;
});