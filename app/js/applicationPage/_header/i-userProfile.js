/* global Materialize */
define(function (require) {
	"use strict";

	var $ = require('jquery');
	var Handlebars = require('handlebars');
	var Marionette = require('marionette');
	var Template = require('text!./header.html');

	var Radio = require('radio');

	var ProfileView = require('./../user-profile/view');

	return Marionette.ItemView.extend({
		initialize: function () {
			var self = this;
			var userChannel = Radio.channel('user');
			this.applicationChannel= Radio.channel('application');
			userChannel.on('logged_in', function () {
				self.render();
            });
		},
		events: {
			'click .logout-btn': 'doLogout',
            'click .login-btn': 'doLogin',
			'click .profile-btn': 'showProfile'
		},
		template: Handlebars.compile(Template),
		templateHelpers: {
            isLoggedIn: function () {
                return this.model.isAuthorized();
            },
			photu: function() {
				return this.model.get('picture');
			}
		},
		showProfile: function (e) {
			e.preventDefault();

			this.applicationChannel.trigger("showProfile", profileView);
			// this.showChildView('profile-box', profileView);
		},

        doLogout: function () {
            var self = this;
            this.model.logout().then(function (success) {
                self.render();
            });
        },
        doLogin: function () {
            var self = this;
            this.model.login().then(function (success) {
                self.render();
            });
        },
		onDomRefresh: function() {
		    $('.dropdown-button').dropdown({
                belowOrigin: true,
				constrain_width: false
            });
		},
	});
});