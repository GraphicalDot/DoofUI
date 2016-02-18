define(function (require) {
	"use strict";

	var Handlebars = require('handlebars');
	var Marionette = require('marionette');
	var Template = require('text!./userMenu.html');

	return Marionette.ItemView.extend({
		id: 'userMenu',
		template: Handlebars.compile(Template),
		templateHelpers: {
			isLoggedIn: function () {
				return this.model.isAuthorized();
			}
		},
		ui: {
			'loginBtn': '#usermenu__login-btn',
			'userProfileDropdown': '.usermenu__user-dropdown-activator',
			'userProfileLink': '#user-profile-dropdown__profile-link',
			'logOutLink': '#user-profile-dropdown__logout-link'
		},
		events: {
			'click @ui.loginBtn': 'doLogin',
			'click @ui.userProfileLink': 'showProfile',
			'click @ui.logOutLink': 'doLogout',
		},
		doLogin: function (e) {
			e.preventDefault();
			var self = this;
			this.model.login().then(function (success) {
				self.render();
			}, function (err) { console.log('Trouble logging in.. We apologize') });
		},
		showProfile: function (e) {
			e.preventDefault();
			this.triggerMethod('show:profile');
		},

		doLogout: function () {
			var self = this;
			this.model.logout().then(function (success) {
				self.render();
			});
		},
		onDomRefresh: function () {
			this.ui.userProfileDropdown.dropdown({
				belowOrigin: true,
				constrain_width: false
			});
		},
	});
});