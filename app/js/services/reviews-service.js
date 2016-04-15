define(function (require) {
	'use strict';

	var Service = require('marionette-service');
	var Promise = require('es6promise').Promise;

	// var UserProfileReviews = require('./../models/reviews/user-reviews');
	// var WriteReviews = require('./../models/reviews/write-restaurant-reviews');
	var RestaurantReviews = require('./../models/reviews/fetch-restaurant-reviews');

	var ReviewsService = Service.extend({
		intialize: function () {
			// this.userProfileReview = new UserProfileReviews();
			this.restaurantReviews = new RestaurantReviews();
			// this.WriteReview = new WriteReviews();
		},
		requests: {
			'getRestaurantReview': 'fetchRestaurantReviews',
			// 'writeReview': 'write',
			// 'getUserReviews': 'fetchUserReviews'
		},
		// fetchUserReviews: function (user_id) {
		// 	var self = this;
		// 	var promise = new Promise(function (resolve, reject) {
		// 		self.userProfileReview.fetch({ method: 'POST', data: { fb_id: user_id } }).then(function () {
		// 			resolve(self.userProfileReview);
		// 		}).fail(function () {
		// 			reject();
		// 		});
		// 	});
		// 	return promise;
		// },
		fetchRestaurantReviews: function (restaurant_id) {
			var self = this;
			console.log(1);
			var promise = new Promise(function (resolve, reject) {
				self.restaurantReviews.fetch({ method: 'POST', data: { __eatery_id: restaurant_id } }).then(function () {
					console.log(self.restaurantReviews);
					resolve(self.restaurantReviews.toJSON());
				}).fail(function () {
					console.log('error in fetching reviews');
				});
			});
			return promise;
		},
		// write: function () {},
	});

	return ReviewsService;
});