define(function (require) {
	"use strict";

	var Backbone = require('backbone');
	var Marionette = require('marionette');

	var FacebookUser = require('./models/facebookUser');
	var Router = require('./router');

	var Doof = new Marionette.Application();
	Doof.addRegions({ region: '.doof' })

	// 1. Load Helper Functions for Libraries.
	// 2. Check Facebook Connection and Login Status
	Doof.on("before:start", function () {

		require(['./helpers']);

		var fbUser = new FacebookUser();
		fbUser.init()
			.then(function () { return fbUser.checkLogin(); })
			.then(function () { return fbUser.fetchInfo(); })
			.then(function () {
				fbUser.sendUserData();
				Doof.vent.trigger("start:app", fbUser);
			})
			.catch(console.log.bind(console));
	});

	// After Facebook Check.. Start our Router and Application..
	Doof.vent.bind("start:app", function (fbUser) {
		Doof.router = new Router({ region: Doof.region, user: fbUser });
		if (Backbone.history) {
			Backbone.history.start();
		}
		if(fbUser.isAuthorized()) {
			Doof.router.navigate('application', {trigger: true});
		} else {
			Doof.router.navigate('landing', {trigger: true});
		}
	});
	return Doof;
});