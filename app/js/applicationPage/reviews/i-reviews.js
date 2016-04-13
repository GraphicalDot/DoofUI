define(function (require) {
	'use strict';

	var Backbone= require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./reviews.html');
	var EmptyTemplate= require('text!./empty-reviews.html');

	// Data Service Facility for Getting and Write Reviews;
	var ReviewsDataService = require('../../models/reviews-service');

	var ReviewModel = Backbone.Model.extend();
	var ReviewsCollection = Backbone.Collection.extend({ model: ReviewModel });

	var ReviewView= Marionette.ItemView.extend({
		className: 'review',
		tagName: 'li',
		template: Handlebars.compile(Template),
	});

	var EmptyReview= Marionette.ItemView.extend({
		className: 'empty-review',
		tagName: 'li',
		template: Handlebars.compile(EmptyTemplate)
	});

	var ReviewsView = Marionette.CollectionView.extend({
		className: 'doof-reviews',
		tagName: 'ul',
		initialize: function (opts) {
			var self = this;
			this.restaurant_id = opts.restaurant_id;
			this.region = opts.region;

			this.collection= new ReviewsCollection();
			// this.model.on('add', this.render, this);

			this.dataService = new ReviewsDataService({ restaurant_id: this.restaurant_id });
			this.dataService.fetch().then(function (reviews_list) {
				self.collection.reset(reviews_list);
				self.region.show(self);
			}, function (fail) {
				console.log('is anybody in here?"');
			});
		},
		childView: ReviewView,
		emptyView: EmptyReview,
		isEmpty: function() {
			var data= this.collection.toJSON();
			if(data.length && data[0].__eatery_id) {
				return false;
			}
			return true;
		}
	});

	return ReviewsView;
});