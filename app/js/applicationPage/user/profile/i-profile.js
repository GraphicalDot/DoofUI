define(function(require) {
	'use strict';

	var $= require('jquery');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./profile.html');

	var ProfileView= Marionette.ItemView.extend({
		id: 'profileView',
		template: Handlebars.compile(Template),
		initialize: function(opts) {
			var self= this;
			var id= this.model.get('id');

			this.userReviews= '';

			this.reviewsService= opts.reviewsService;
			this.reviewsService.getUserReviews(id)
				.then(function(user_reviews) {
					self.userReviews= user_reviews;
					console.log(user_reviews);
					self.render();
				})
				.catch(console.log.bind(console));
		},
		templateHelpers: function () {
			return {
				reviews: function () {
					return self.userReviews;
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