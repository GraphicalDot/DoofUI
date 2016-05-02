define(function (require) {
	"use strict";

	var Backbone = require('backbone');
	var Marionette = require('marionette');

	var Doof = new Marionette.Application();
	Doof.addRegions({ region: '.doof' });

	/**
	 * Before Starting, Check for Server Connection(Jwt, APIS).
	 * If cant connect, cant go [ ofcourse there is no use in going ahead anyways ]
	 */
	var ServerServices = require('./models/s_server');
	Doof.on("before:start", function () {
		// When Server Connection is done [ We get JWT Token and APIS List.. ]
		var serverServices = new ServerServices();
		serverServices.getJwt().then(function () {
			return serverServices.getApis();
		}).then(function () {
			Doof.vent.trigger("check:facebook");
		}).catch(function () {
			require(['jquery'], function ($) {
				$('.loader span').html('Connection to Server Failed.. Please retry later!');
			});
		});
	});

	/**
	 * Check for Facebook USER here.
	 * Facebook Connection is optional -> If we cant connect to Facebook, just simply try to navigate to Application as GUEST.
	 */
	var FacebookUser = require('./models/m_facebookUser');
	Doof.vent.bind("check:facebook", function () {
		var fbUser = new FacebookUser();
		fbUser.init()
			.then(function () { return fbUser.checkLogin(); })
			.then(function () { return fbUser.fetchInfo(); })
			.then(function () {
				fbUser.sendUserData();
				Doof.vent.trigger("start:app", fbUser);
			}).catch(function (msg) {
				require(['jquery'], function ($) {
					$('.loader span').html(msg);
				});
				Doof.vent.trigger("start:app", fbUser);
			});
	});

	/**
	 * Load Helpers
	 * Start Router and Application..
	 */
	var Router = require('./router');
	Doof.vent.bind("start:app", function (fbUser) {
		require(['./helpers']);
		Doof.router = new Router({ region: Doof.region, user: fbUser });
		if (Backbone.history) {
			Backbone.history.start();
		}
	});

	Doof.start();
	return Doof;
});