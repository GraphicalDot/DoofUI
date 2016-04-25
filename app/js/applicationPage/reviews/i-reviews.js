define(function (require) {
	'use strict';

	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./reviews.html');
	var SingleTemplate = require('text!./review.html');
	var EmptyTemplate = require('text!./empty-reviews.html');


	var ReviewView = Marionette.ItemView.extend({
		className: 'review',
		tagName: 'li',
		template: Handlebars.compile(SingleTemplate),
	});

	var EmptyReview = Marionette.ItemView.extend({
		className: 'empty-review',
		tagName: 'li',
		template: Handlebars.compile(EmptyTemplate)
	});

	var ReviewsView = Marionette.CompositeView.extend({
		className: 'doof-reviews',
		initialize: function (opts) {
			this.restaurant_id = opts.restaurant_id;
			this.reviewsService.getRestaurantReview(this.restaurant_id).then(function (reviews_list) {
				self.collection= reviews_list;
				// self.region.show(self);
			}, function (fail) {
				console.log('is anybody in here?"');
			});
		},
		template: Handlebars.compile(Template),
		childView: ReviewView,
		emptyView: EmptyReview,
		isEmpty: function () {
			var data = this.collection.toJSON();
			if (data.length && data[0].__eatery_id) {
				return false;
			}
			return true;
		},
		childViewContainer: ".reviews-list",
	});

	return ReviewsView;
});