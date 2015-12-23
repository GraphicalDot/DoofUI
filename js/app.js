define(function(require) {

	"use strict";

	var Backbone= require('backbone');
	var Marionette= require('backbone.marionette');

	var Router= require('./router');

	var App= new Marionette.Application();

	App.on("before:start", function(opts) {
		App.addRegions({
			'main': opts.el
		});
	});

	App.on("start", function(opts) {
		new Router({doofRegion: App.main});
		if(Backbone.history) {
			Backbone.history.start();
		}
	});

	return App;
});