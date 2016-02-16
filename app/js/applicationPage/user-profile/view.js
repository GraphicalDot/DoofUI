define(function (require) {

	"use strict";

	var $ = require('jquery');
	var Handlebars = require('handlebars');
	var Marionette = require('marionette');
	var Template = require('text!./user-profile.html');

	var UserReviews = require('./../../models/user_profile');

	return Marionette.ItemView.extend({
		id: "user-profile",
		template: Handlebars.compile(Template),
		initialize: function () {
			var self = this;
			var id = this.model.get('id');
			this.reviews = new UserReviews();
			this.reviews.fetch({ method: "POST", data: { fb_id: id } }).then(function () {
				self.render();
			});
		},
		templateHelpers: function () {
			return {
				reviews: function () {
					return this.reviews.toJSON();
				},
				userPhoto: function () {
					return this.model.get('image');
				}
			}
		},
		events: {
			'click .close-user-profile-btn': 'removeSelf'
		},
		removeSelf: function (e) {
			e.preventDefault();
			this.destroy();
			$('.profile-box').addClass('hide');
		},
		onShow: function () {
			$('.profile-box').removeClass('hide');
		}
	});
});