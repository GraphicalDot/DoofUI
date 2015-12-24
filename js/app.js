define(function (require) {

	"use strict";

	var Backbone = require('backbone');
	var Marionette = require('backbone.marionette');

	var FB = require('facebook');

	var User = require('./models/user');
	var Router = require('./router');

	var App = new Marionette.Application();

	App.on("before:start", function (opts) {
		App.addRegions({
			'main': opts.el
		});

		FB.init({
			appId: "1605945752959547",
			version: "v2.5",
			status: true
		});

		FB.getLoginStatus(function (response) {
			var user = new User({ facebookAuthResponse: response });
			user.fetchUserData().then(function (success) { App.vent.trigger('lets:start', opts, user) }, function (err) { App.vent.trigger('lets:start', opts, user) });
		});
	});

	App.vent.bind("lets:start", function (opts, user) {
		new Router({ doofRegion: App.main, user: user });
		if (Backbone.history) {
			Backbone.history.start();
		}
	});

	return App;
});