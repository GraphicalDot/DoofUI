define(function (require) {

	"use strict";

	var _= require('underscore');
	var Backbone= require('backbone');
	var Marionette = require('backbone.marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./landingPage.html');

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

	return Marionette.ItemView.extend({
		id: 'landingPage',
		className: 'center white-text',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.model= opts.user;
		},
		templateHelpers: {
			isLoggedIn: function() {
				return this.model.isAuthorized();
			},
		},
		events: {
			'click .login-btn': 'doLogin',
			'click .logout-btn': 'doLogout'
		},
		doLogin: function(e) {
			var self= this;
			e.preventDefault();
			this.model.login().then(function(success) {
				self.render();
				$('.dropdown-button').dropdown();
			}, function(error) {});
		},
		doLogout: function(e) {
			var self= this;
			e.preventDefault();
			this.model.logout().then(function() {
				self.render();
			});
		},
		onShow: function() {
			$('.dropdown-button').dropdown();
		}
	});
});