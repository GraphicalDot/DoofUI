define(function (require) {
	'use strict';

	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./searchBox.html');

	var SearchBoxView = Marionette.ItemView.extend({
		id: 'doofSearch',
		template: Handlebars.compile(Template)
	});
	return SearchBoxView;
});