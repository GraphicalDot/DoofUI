define(function(require) {
	'use strict';

	var Marionette= require('marionette');
	var Handlebars= require('handlebars');

	var Template= require('text!./landingPage.html');

	var LandingPage= Marionette.ItemView.extend({
		template: Handlebars.compile(Template)
	});

	return LandingPage;
});