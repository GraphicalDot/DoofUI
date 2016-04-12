define(function(require) {
	'use strict';

	var $= require('jquery');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./profile.html');

	var UserReviews = require('./../../../models/user_profile');

	var ProfileView= Marionette.ItemView.extend({
		id: 'profileView',
		template: Handlebars.compile(Template),
		initialize: function() {
			var self= this;
			var id= this.model.get('id');
			this.reviews= new UserReviews();
			this.reviews.fetch({ method: "POST", data: { fb_id: id } }).then(function () {
				self.render();
			});
		},
		templateHelpers: function () {
			return {
				reviews: function () {
					return this.reviews.toJSON();
				}
			}
		},
		events: {
			'click .user-profile__close-btn': 'removeSelf'
		},
		removeSelf: function (e) {
			e.preventDefault();
			this.destroy();
			$('.body__profile-box').addClass('hide');
		},
		onShow: function () {
			$('.body__profile-box').removeClass('hide');
		}
	});

	return ProfileView;
});