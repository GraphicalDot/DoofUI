define(function(require) {
	'use strict';

	var _= require('underscore');
	var Marionette= require('marionette');
	var Handlebars= require('handlebars');
	var Template= require('text!./detail.html');

	var DetailView= Marionette.ItemView.extend({
		id: 'detailView',
		template: Handlebars.compile(Template),
		initialize: function(opts) {
			this.restaurant_detail= opts.restaurant_detail;
			this.user= opts.user;
		},
		ui: {
			'tabs': '.restaurant-tabs-menu',
			'ambienceOverview': '.ambience-overview',
			'serviceOverview': '.service-overview',
			'foodOverview': '.food-item-list',
			'closeBtn': '.restaurant-details__close-btn'
		},
		events: {
			'click @ui.closeBtn': 'closeDetails'
		},
		templateHelpers: function () {
			return {
				'restaurant-name': function () {
					return this.restaurant_detail.eatery_details.eatery_name;
				},
				'restaurant-address': function () {
					return this.restaurant_detail.eatery_details.eatery_address;
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
					var max_sentiments= _.max(ambienceList, function(ambienceItem) {return ambienceItem.total_sentiments;})
					var notReviewedAmbienceItem = [];
					var reviewedAmbienceItem= {};
					_.each(ambienceList, function (ambienceItem, key, obj) {
						ambienceItem.max_sentiments= max_sentiments.total_sentiments;
						if (ambienceItem.total_sentiments) {
							reviewedAmbienceItem[key]= ambienceItem;
						} else {
							notReviewedAmbienceItem.push(key);
						};
					});
					return { filtered: reviewedAmbienceItem, notReviewed: notReviewedAmbienceItem };
				},
				'service-items': function() {
					var serviceList = this.model.get('service');
					var max_sentiments= _.max(serviceList, function(serviceItem) {return serviceItem.total_sentiments;})
					var notReviewedServiceItem = [];
					var reviewedServiceItem= {};
					_.each(serviceList, function (serviceItem, key, obj) {
						serviceItem.max_sentiments= max_sentiments.total_sentiments;
						if (serviceItem.total_sentiments) {
							reviewedServiceItem[key]= serviceItem;
						} else {
							notReviewedServiceItem.push(key);
						};
					});
					return { filtered: reviewedServiceItem, notReviewed: notReviewedServiceItem };
				},
				'food-items': function() {
					var foodList= this.model.get('food');
					var max_sentiments= parseInt(foodList[0].total_sentiments);
					foodList= _.each(foodList, function(foodItem, key, obj) {
						foodItem.max_sentiments= max_sentiments;
					});
					return foodList;
				},
			}
		},
		onShow: function() {
			var self = this;
			require(['tabs', 'collapsible'], function() {
				self.ui.tabs.tabs();
				self.ui.ambienceOverview.collapsible();
				self.ui.serviceOverview.collapsible();
				self.ui.foodOverview.collapsible();
			});
			this.$el.parent().removeClass('hide');
			// this.reviews.fetch({ method: 'POST', data: { __eatery_id: this.restaurant_detail.__eatery_id } }).then(function () {
			// 	self.reviewsRegion.show(self.reviewsView);
			// });
		},
		closeDetails: function(e) {
			e.preventDefault();
			this.$el.parent().addClass('hide');
			this.remove();
		}
	});
	return DetailView;
});