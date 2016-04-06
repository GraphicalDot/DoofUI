define(function(require) {
	'use strict';

	var Marionette= require('marionette');
	var Template= require('text!./loader.html');
	var Handlebars= require('handlebars');

	return Marionette.ItemView.extend({
		template: Handlebars.compile(Template),
		className: 'loader'
	});
});