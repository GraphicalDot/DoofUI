define(function(require) {
	'use strict';

	var Marionette= require('marionette');

	var Router= Marionette.AppRouter.extend({
		initialize: function(opts) {
			this.region= opts.region;
		},
		routes: {
			'': 'landingPage',
			'application': 'application'
		},
		landingPage: function() {
			var LandingPage= require('./landingPage/iLandingPage-view');
			var landingPage= new LandingPage();
			this.region.show(landingPage);
		},
		application: function() {}
	});

	return Router;
});