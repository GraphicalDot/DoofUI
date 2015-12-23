define(function(require) {

	"use strict";

	var Handlebars= require('handlebars');
	var Marionette= require('backbone.marionette');

	var MapView= Marionette.ItemView.extend({
		template: Handlebars.compile("")
	});

	return  MapView;
})