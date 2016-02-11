define(function (require) {
	'use strict';

	var $ = require('jquery');
	var Marionette = require('marionette');

	var Router = Marionette.AppRouter.extend({
		initialize: function (opts) {
			this.region = opts.region;
			this.user= opts.user;
		},
		routes: {
			'': 'landingPage',
			'application': 'application'
		},
		landingPage: function () {
			var LandingPage = require('./landingPage/iLandingPage-view');
			var landingPage = new LandingPage({user: this.user});
			this.region.show(landingPage);
			$(".loader").fadeOut();
		},
		application: function () {
			var ApplicationPage = require('./applicationPage/l-application');
			var applicationPage = new ApplicationPage({user: this.user});
			this.region.show(applicationPage);
		 }
	});

	return Router;
});