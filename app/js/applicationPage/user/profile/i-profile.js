define(function(require) {
	'use strict';

	var $= require('jquery');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./profile.html');

	var ReviewsView = require('./../../reviews/i-reviews');

	var ProfileView= Marionette.ItemView.extend({
		id: 'profileView',
		template: Handlebars.compile(Template),
		initialize: function(opts) {
			this.reviewsService= opts.reviewsService;
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
			var self= this;
			var id= this.model.get('id');
			this.reviewsRegion = new Marionette.Region({
				el: '.user-profile__reviews-wrapper'
			});
			this.reviewsService.getUserReviews(id)
				.then(function(user_reviews) {
					// Its coming in object, thats why converting to array..
					var user_reviews_array= Object.keys(user_reviews).map(function(k) { return user_reviews[k] });
					self.reviewsView= new ReviewsView({ reviews: user_reviews_array });
					self.reviewsRegion.show(self.reviewsView);
				})
				.catch(console.log.bind(console));
			$('.body__profile-box').removeClass('hide');
		}
	});

	return ProfileView;
});