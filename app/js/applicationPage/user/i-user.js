define(function (require) {
	'use strict';

	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./user.html');

	var UserView = Marionette.ItemView.extend({
		id: 'userView',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.userProfileRegion = opts.userProfileRegion;
		},
		ui: {
			'userProfileDropdown': '.user-menu__user-link',
		},
		templateHelpers: {
			isLogged: function () {
				return this.model.isAuthorized();
			}
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