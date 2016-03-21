/*
 * This View opens Single Restaurant Detail Card.
 * Here, we show Restaurant Details, Food, Photos and its Reviews.
 * Input : Restaurant_ID
 * APIS used : Get Restaurant-Details, Get Restaurant-Reviews
 *
*/
define(function (require) {
	'use strict';

	var $ = require('jquery');
	var _ = require('underscore');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./detailView.html');

	var ReviewsCollection = require('./../../models/fetch_review');
	var ReviewsView = require('./../reviewsView/i-reviews');

	function escapedHtml(text) {
		return text
			.replace(/&amp;/g, '&');
	}

	return Marionette.ItemView.extend({
		id: 'detail-view',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.user = opts.user;
			this.restaurant_detail = opts.restaurant_detail ? opts.restaurant_detail : {};
			this.reviewsRegion = new Marionette.Region({
				el: '#restaurant-reviews-tab'
			});
			this.reviews = new ReviewsCollection();
			this.reviewsView = new ReviewsView({ collection: this.reviews });
		},
		ui: {
			'tabs': '.restaurant-tabs-menu',
			'ambienceOverview': '.ambience-overview',
			'serviceOverview': '.service-overview'
		},
		templateHelpers: function () {
			return {
				'restaurant-name': function () {
					return this.restaurant_detail.eatery_details ? escapedHtml(this.restaurant_detail.eatery_details.eatery_name) : '';
				},
				'restaurant-address': function () {
					return this.restaurant_detail.eatery_details ? escapedHtml(this.restaurant_detail.eatery_details.eatery_address) : '';
				},
				'restaurant-reviews': function () {
					var restaurant_sentiments = this.model.get('overall');
					var highest_value = 0;
					var highest_sentiment = '';
					_.each(restaurant_sentiments, function (value, key, obj) {
						if (value > highest_value && key !== 'total_sentiments') {
							highest_value = value;
							highest_sentiment = key;
						}
					});
					if (highest_sentiment === 'excellent') {
						return '<i class="material-icons active">sentiment_very_satisfied</i><i class="material-icons active">sentiment_very_satisfied</i><i class="material-icons active">sentiment_very_satisfied</i><i class="material-icons active">sentiment_very_satisfied</i><i class="material-icons active">sentiment_very_satisfied</i>';
					} else if (highest_sentiment === 'good') {
						return '<i class="material-icons active">sentiment_satisfied</i><i class="material-icons active">sentiment_satisfied</i><i class="material-icons active">sentiment_satisfied</i><i class="material-icons active">sentiment_satisfied</i><i class="material-icons">sentiment_satisfied</i>'
					} else if (highest_sentiment === 'mix' || highest_sentiment === 'average') {
						return '<i class="material-icons active">sentiment_neutral</i><i class="material-icons active">sentiment_neutral</i><i class="material-icons active">sentiment_neutral</i><i class="material-icons">sentiment_neutral</i><i class="material-icons">sentiment_neutral</i>'
					} else if (highest_sentiment === 'poor') {
						return '<i class="material-icons active">sentiment_dissatisfied</i><i class="material-icons active">sentiment_dissatisfied</i><i class="material-icons">sentiment_dissatisfied</i><i class="material-icons">sentiment_dissatisfied</i><i class="material-icons">sentiment_dissatisfied</i>'
					} else {
						return '<i class="material-icons active">sentiment_very_dissatisfied</i><i class="material-icons">sentiment_very_dissatisfied</i><i class="material-icons">sentiment_very_dissatisfied</i><i class="material-icons">sentiment_very_dissatisfied</i><i class="material-icons">sentiment_very_dissatisfied</i>'
					}
				},
				'ambience-items': function () {
					var ambienceList = this.model.get('ambience');
					var notReviewedAmbienceItem = [];
					var reviewedAmbienceItem= {};
					_.each(ambienceList, function (ambienceItem, key, obj) {
						if (ambienceItem.total_sentiments) {
							reviewedAmbienceItem[key]= ambienceItem;
						} else {
							notReviewedAmbienceItem.push(key);
						};
					});
					return { filtered: reviewedAmbienceItem, notReviewed: notReviewedAmbienceItem };
				},
				'service-items': function() {
					var ambienceList = this.model.get('service');
					var notReviewedAmbienceItem = [];
					var reviewedAmbienceItem= {};
					_.each(ambienceList, function (ambienceItem, key, obj) {
						if (ambienceItem.total_sentiments) {
							reviewedAmbienceItem[key]= ambienceItem;
						} else {
							notReviewedAmbienceItem.push(key);
						};
					});
					return { filtered: reviewedAmbienceItem, notReviewed: notReviewedAmbienceItem };
				},
				'food-items': function() {
					var foodList= this.model.get('food');
					var max_sentiments= parseInt(foodList[0].total_sentiments);
					foodList= _.each(foodList, function(foodItem, key, obj) {
						foodItem.max_sentiments= max_sentiments;
					});
					return foodList;
				},
				'get_percent': function(opts) {
					console.log(opts);
					return '70%';
				}
			}
		},
		onShow: function () {
			var self = this;
			this.ui.tabs.tabs();
			this.ui.ambienceOverview.collapsible();
			this.ui.serviceOverview.collapsible();
			$('.grid-item').materialbox();
			$('.body__detail-box').removeClass('hide');
			this.reviews.fetch({ method: 'POST', data: { __eatery_id: this.restaurant_detail.__eatery_id } }).then(function () {
				self.reviewsRegion.show(self.reviewsView);
			});

			$('.food-item-list').collapsible();
		},
		onClose: function () {
			$('.body__detail-box').addClass('hide');
		}
	});
});