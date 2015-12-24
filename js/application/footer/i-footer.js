define(function (require) {

	"use strict";

	var Handlebars = require('handlebars');
	var Marionette = require('backbone.marionette');
	var Template = require('text!./footer.html');

	var FooterView = Marionette.ItemView.extend({
		template: Handlebars.compile(Template)
	});

	return FooterView;
})