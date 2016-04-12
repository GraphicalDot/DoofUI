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
		},
		showProfile: function (e){
			e.preventDefault();
			this.profileView= new ProfileView({model: this.model});
			this.userProfileRegion.show(this.profileView);
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