define(function (require) {
	'use strict';

	var Backbone= require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./reviews.html');
	var SingleTemplate = require('text!./review.html');
	var EmptyTemplate = require('text!./empty-reviews.html');

	var ReviewModel = Backbone.Model.extend();
	var ReviewCollection = Backbone.Collection.extend({ model: ReviewModel });

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
		template: Handlebars.compile(Template),
		childView: ReviewView,
		emptyView: EmptyReview,
		initialize: function(opts) {
			console.log(opts.reviews);
			this.collection= new ReviewCollection(opts.reviews);
			// this.collection.on('add', this.render, this);
		},
		isEmpty: function () {
			var data = this.collection.toJSON();
			if (data.length && data[0].__eatery_id) {
				return false;
			}
			return true;
		},
		addReview: function(new_review_model) {
			var m= new ReviewModel(new_review_model);
			console.log(m);
			this.collection.add(m);
		},
		childViewContainer: ".reviews-list",
	});

	return ReviewsView;
});