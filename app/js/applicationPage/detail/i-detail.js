define(function(require) {
	'use strict';

	var Marionette= require('marionette');
	var Handlebars= require('handlebars');
	var Template= require('text!./detail.html');

	var DetailView= Marionette.ItemView.extend({
		template: Handlebars.compile(Template),
		initialize: function(opts) {},
		onShow: function() {
			this.$el.parent().removeClass('hide');
		}
	});
	return DetailView;
});