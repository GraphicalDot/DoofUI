define(function (require) {
	'use strict';

	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');

	$.fn.enterKey = function (fnc) {
		return this.each(function () {
			$(this).keypress(function (ev) {
				var keycode = (ev.keyCode ? ev.keyCode : ev.which);
				if (keycode == '13') {
					fnc.call(this, ev);
				}
			});
		});
	}

	// extra code to add template helper functionality to marionnete view.
	Backbone.Marionette.ItemView.prototype.mixinTemplateHelpers = function (target) {
		var self = this;
		var templateHelpers = Marionette.getOption(self, "templateHelpers");
		var result = {};

		target = target || {};

		if (_.isFunction(templateHelpers)) {
			templateHelpers = templateHelpers.call(self);
		}

		// This _.each block is what we're adding
		_.each(templateHelpers, function (helper, index) {
			if (_.isFunction(helper)) {
				result[index] = helper.call(self);
			} else {
				result[index] = helper;
			}
		});

		return _.extend(target, result);
	};

	function escapeHtml(text) {
		return text
			.replace(/&amp;/g, '&');
	}

	Handlebars.registerHelper("escaped", function (something) {
		return escapeHtml(something);
	});

	Handlebars.registerHelper('undasherized-text', function(opts) {
		function toTitleCase(str) {
			if (str) {
				return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }).replace(/-/g, ' ');
			} else {
				return str;
			}
		}
		return toTitleCase(opts.fn(this));
	});


	return true;
});