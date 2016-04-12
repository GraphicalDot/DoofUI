define(function (require) {
	'use strict';

	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./user.html');

	var ProfileView= require('./profile/i-profile');

	var UserView = Marionette.ItemView.extend({
		id: 'userView',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.userProfileRegion = opts.userProfileRegion;
		},
		ui: {
			'userProfileDropdown': '.user-menu__user-link',
			'profileLink': '#user-profile-dropdown__profile-link',
			'logOutLink': '#user-profile-dropdown__logout-link',
			'logInLink': '#logged-out-user-menu__login-link'
		},
		templateHelpers: {
			isLogged: function () {
				return this.model.isAuthorized();
			}
		},
		events: {
			'click @ui.profileLink': 'showProfile',
			'click @ui.logOutLink': 'doLogout',
			'click @ui.logInLink': 'doLogin'
		},
		showProfile: function (e){
			e.preventDefault();
			if(this.model.isAuthorized()) {
				this.profileView= new ProfileView({model: this.model});
				this.userProfileRegion.show(this.profileView);
			}
		},
		doLogout: function(e) {
			var self= this;
			e.preventDefault();
			this.model.logout().then(function() {
				self.render();
			});
		},
		doLogin: function(e) {
			var self= this;
			e.preventDefault();
			this.model.login().then(function() {
				self.render();
			});
		},
		onDomRefresh: function () {
			var self = this;
			if (this.model.isAuthorized()) {
				require(['dropdown'], function () {
					self.ui.userProfileDropdown.dropdown({
						belowOrigin: true, constrain_width: false
					});
				});
			}
		},
	});

	return UserView;
});