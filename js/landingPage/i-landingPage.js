define(function(require) {

	"use strict";

	var Marionette= require('backbone.marionette');
	var Handlebars= require('handlebars');
	var Template= require('text!./landingPage.html');

	return Marionette.ItemView.extend({
		id: 'landingPage',
		className: 'center white-text',
		template: Handlebars.compile(Template)
	});
});