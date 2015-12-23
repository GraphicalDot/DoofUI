define(function(require) {

	"use strict";

	var Marionette=  require('backbone.marionette');

	var self;

	var Router= Marionette.AppRouter.extend({
		initialize: function(opts) {
			self= this;
			this.doofRegion= opts.doofRegion;
		},
		appRoutes: {
			"": "landingPage",
			"application": "application"
		},
		controller: {
			"landingPage": function() {
				var LandingPage= require('./landingPage/i-landingPage');
				var landingPage= new LandingPage();
				self.doofRegion.show(landingPage);
			},
			"application": function() {}
		}
	});

	return Router;
});