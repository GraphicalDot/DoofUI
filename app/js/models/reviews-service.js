define(function (require) {
	'use strict';

	var Service = require('marionette-service');
	var Promise = require('es6promise').Promise;

	var UserProfileReviews = require('./reviews/user-reviews');
	var FetchReviews = require('./reviews/fetch-restaurant-reviews');
	var WriteReviews = require('./reviews/write-restaurant-reviews');

	var ReviewsService = Service.extend({
		intialize: function () {
			this.userProfileReview = new UserProfileReviews();
			this.getReviews = new FetchReviews();
			this.WriteReview = new WriteReviews();
		},
		requests: {
			'getReviews': 'fetch',
			'writeReview': 'write',
			'getUserReviews': 'fetchUserReviews'
		},
		fetchUserReviews: function (user_id) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.userProfileReview.fetch({ method: 'POST', data: { fb_id: user_id } }).then(function () {
					resolve(self.userProfileReview);
				}).fail(function () {
					reject();
				});
			});
			return promise;
		},
		fetch: function (restaurant_id) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.getReviews.fetch({ method: 'POST', data: { __eatery_id: restaurant_id } }).then(function () {
					resolve(self.getReviews.toJSON());
				}).fail(function () {
					console.log('error in fetching reviews');
				});
			});
			return promise;
		},
		write: function () {},
	});

	return ReviewsService;
});