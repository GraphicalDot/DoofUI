define(function(require) {
	'use strict';

	var Marionette= require('marionette');

	var App= new Marionette.Application();

	App.on('start', function() {
		console.log('started');
	});

	return App;
});