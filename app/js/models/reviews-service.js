define(function(require) {
	'use strict';

	var Service = require('marionette-service');
	var Promise= require('es6promise').Promise;

	var FetchReviews= require('./reviews/fetch-reviews');
	var WriteReviews= require('./reviews/write-reviews');

	var ReviewsService= Service.extend({
		initialize: function(opts) {
			this.restaurant_id= opts.restaurant_id;
			this.getReviews= new FetchReviews();
			this.WriteReview= new WriteReviews();
		},
		requests: {
			'getReviews': 'fetch',
			'writeReview': 'write'
		},
		fetch: function(restaurant_id) {
			var self= this;
			var promise= new Promise(function(resolve, reject) {
				self.getReviews.fetch({ method: 'POST', data: { __eatery_id: self.restaurant_id } }).then(function () {
					console.log(self.getReviews.toJSON());
					resolve(self.getReviews.toJSON());
				}).fail(function() {
					console.log('error in fetching reviews');
				});
			});
			return promise;
		},
		write: function() {},
	});

	return ReviewsService;
});