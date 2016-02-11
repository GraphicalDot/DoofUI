define(function(require) {
	'use strict';

	var Backbone= require('backbone');
	var Marionette= require('marionette');

	var FacebookUser= require('./models/facebookUser');
	var Router= require('./router');

	var App= new Marionette.Application();
	App.addRegions({doof: '.doof'});

	App.on('start', function() {
		var fbUser= new FacebookUser();
		fbUser.init().then(function() {
			return fbUser.checkLogin();
		}).then(function() {
			return fbUser.fetchInfo();
		}).then(function() {
			App.router= new Router({region: App.doof, user: fbUser});
			if(Backbone.history) {
				Backbone.history.start();
			}
		}).catch(console.log.bind(console));
	});

	return App;
});