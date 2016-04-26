/**
 * This Service is responsible for fetching and writing Review
 */
define(function (require) {
	'use strict';

	var Service = require('marionette-service');
	var Promise = require('es6promise').Promise;

	var UserProfileReviews = require('./../models/reviews/user-reviews');
	var WriteReviews = require('./../models/reviews/write-restaurant-reviews');
	var RestaurantReviews = require('./../models/reviews/fetch-restaurant-reviews');

	var ReviewsService = Service.extend({
		initialize: function () {
			this.userProfileReview = new UserProfileReviews();
			this.restaurantReviews = new RestaurantReviews();
			this.writeReview = new WriteReviews();
		},
		requests: {
			'getRestaurantReview': 'fetchRestaurantReviews',
			'getUserReviews': 'getUserReviews',
			'writeReview': 'writeReview',
		},
		getUserReviews: function (user_id) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.userProfileReview.fetch({ method: 'POST', data: { fb_id: user_id } }).then(function () {
					resolve(self.userProfileReview.toJSON());
				}).fail(function () {
					reject();
				});
			});
			return promise;
		},
		fetchRestaurantReviews: function (restaurant_id) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.restaurantReviews.fetch({ method: 'POST', data: { __eatery_id: restaurant_id } }).then(function () {
					resolve(self.restaurantReviews.toJSON());
				}).fail(function () {
					console.log('error in fetching reviews');
				});
			});
			return promise;
		},
		writeRestaurantReview: function (restaurant_id, facebookUser, reviewText) {
			var self= this;
			var promise= new Promise(function(resolve, reject) {
				self.writeReview.fetch({method: 'POST', data: {__eatery_id: restaurant_id, name: facebookUser, review_text: reviewText}}).then(function() {
					resolve('Done');
				}).fail(function() {
					console.log('Fail');
					reject();
				});
			});
			return promise;
		 },
	});

	return ReviewsService;
});