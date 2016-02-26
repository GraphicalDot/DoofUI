/*
 * This View opens Single Restaurant Detail Card.
 * Here, we show Restaurant Details, Food and its Reviews.
 * Input :
 * APIS used :
 *
*/
define(function (require) {
	'use strict';

	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./detailView.html');

	var ReviewsCollection = require('./../../models/fetch_review');
	var ReviewsView = require('./../reviewsView/i-reviews');

	Handlebars.registerHelper('positivity', function(opts) {
		if(opts.excellent > opts.good) {
			return '<i class="material-icons">sentiment_very_satisfied</i><span>'+opts.excellent+opts.good+'</span>'
		} else {
			return '<i class="material-icons">sentiment_satisfied</i><span>'+opts.excellent+opts.good+'</span>'
		}
	});

	var DetailView = Marionette.ItemView.extend({
		id: 'detail-view',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.restaurant_detail = opts.restaurant_detail;
			this.user = opts.user;

			this.reviewsRegion = new Marionette.Region({
				el: '#reviews-tab'
			});
			this.reviews = new ReviewsCollection();
			this.reviewsView = new ReviewsView({ collection: this.reviews, __eatery_id: this.restaurant_detail.__eatery_id });
		},
		templateHelpers: function () {
			return {
				'restaurant-name': this.restaurant_detail.eatery_details.eatery_name,
				'restaurant-address': this.restaurant_detail.eatery_details.eatery_address,
				// 'positive_sentiment': function(input) {

				// 	if(input.excellent > input.good) {
				// 		return '<i class="material-icons">sentiment_very_satisfied</i><span>'+input.excellent+input.good+'</span>'
				// 	} else {
				// 		return '<i class="material-icons">sentiment_satisfied</i><span>'+input.excellent+input.good+'</span>'
				// 	}
				// },
				// 'negative_sentiment': function(input) {
				// 	if(input.terrible > input.poor) {
				// 		return '<i class="material-icons">sentiment_very_dissatisfied</i><span>'+input.terrible+input.poor+'</span>'
				// 	} else {
				// 		return '<i class="material-icons">sentiment_dissatisfied</i><span>'+input.terrible+input.poor+'</span>'
				// 	}
				// },
				// 'neutral_sentiment': function(input) {
				// 	return '<i class="material-icons">sentiment_neutral</i><span>'+input.average+input.mixed+'</span>'
				// },
			}
		},
		ui: {
			'tabs': '.restaurant-details__tabs',
			'reviewBox': ".reviews-list"
		},
		onShow: function () {
			var self = this;
			this.ui.tabs.tabs();
			$('.detail').removeClass('hide');

			this.reviews.fetch({ method: 'POST', data: { __eatery_id: this.restaurant_detail.__eatery_id } }).then(function () {
				self.reviewsView.render();
				$(self.ui.reviewBox).html(self.reviewsView.el);
			});
		},
	});

	return DetailView;
});