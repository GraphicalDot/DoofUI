define(function(require) {

	"use strict";

	var Handlebars= require('handlebars');
	var Marionette= require('backbone.marionette');
	var Template= require('text!./header.html');

	var HeaderView= Marionette.ItemView.extend({
		template: Handlebars.compile(Template)
	});

	return  HeaderView;
});