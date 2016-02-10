define(function(require) {
	'use strict';

	var Backbone= require('backbone');
	var Marionette= require('marionette');

	var Router= require('./router');

	var App= new Marionette.Application();
	App.addRegions({doof: '.doof'});

	App.on('start', function() {
		App.router= new Router({region: App.doof});
		if(Backbone.history) {
			Backbone.history.start();
		}
	});

	return App;
});