/* global Materialize */
define(function (require) {
	'use strict';

	var _ = require('underscore');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./detail.html');

	var ReviewsView = require('./../reviews/i-reviews');

	var DetailView = Marionette.ItemView.extend({
		id: 'detailView',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.restaurant_detail = opts.restaurant_detail;
			this.user = opts.user;
			this.reviewsService = opts.reviewsService;
			// console.l
			// this.reviewsView = new ReviewsView({ restaurant_id: this.restaurant_detail.__eatery_id, reviewsService: this.reviewsService });
		},
		ui: {
			'tabs': '.restaurant-tabs-menu',
			'ambienceOverview': '.ambience-overview',
			'serviceOverview': '.service-overview',
			'foodOverview': '.food-item-list',
			'closeBtn': '.restaurant-details__close-btn',
			'reviewsBox': '#review-box',
			'writeReviewBtn': '.submit-review-form',
			'addDishModalOpenBtn': '.details__food-menu_addDishBtn',
			'addDishBtn': '.add-dish__modal_submit-btn',
			'ambienceSentimentsAction': '.ambience-item-actions-wrapper i'
		},
		events: {
			'click @ui.closeBtn': 'closeDetails',
			'click @ui.writeReviewBtn': 'writeReview',
			'click @ui.addDishBtn': 'submitDish',
			'click @ui.ambienceSentimentsAction': 'ambienceItemSentimentUpdate'
		},
		templateHelpers: function () {
			return {
				'restaurant-name': function () {
					return this.model.get('eatery_name');
					// return this.model.eatery_details.eatery_name;
				},
				'restaurant-address': function () {
					return this.model.get('eatery_address');
					// return this.model.eatery_details.eatery_address;
				},
				'restaurant-cost': function() {
					var expensive = this.model.get('cost').expensive;
					var highest_value = 0;
					var highest_sentiment = '';
					_.each(expensive, function (value, key, obj) {
						if (value > highest_value && key !== 'total_sentiments') {
							highest_value = value;
							highest_sentiment = key;
						}
					});
					if (highest_sentiment === 'excellent') {
						return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg>';
					} else if (highest_sentiment === 'good') {
						return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg>'
					} else if (highest_sentiment === 'mix' || highest_sentiment === 'average') {
						return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg>'
					} else if (highest_sentiment === 'poor') {
						return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg>'
					} else {
						return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="39.5 -0.5 169.756 250" enable-background="new 39.5 -0.5 169.756 250" xml:space="preserve"><path fill="#010101" d="M152.511,23.119h41.031L209.256-0.5H55.214L39.5,23.119h26.739c27.086,0,52.084,2.092,62.081,24.743H55.214 L39.5,71.482h91.769c-0.002,0.053-0.002,0.102-0.002,0.155c0,16.974-14.106,43.01-60.685,43.01l-22.537-0.026l0.025,22.068 L138.329,249.5h40.195l-93.42-116.709c38.456-2.074,74.523-23.563,79.722-61.309h28.716l15.714-23.62h-44.84 C162.606,38.761,158.674,29.958,152.511,23.119z"/></svg>'
					}
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
					var max_sentiments = _.max(ambienceList, function (ambienceItem) { return ambienceItem.total_sentiments; })
					var notReviewedAmbienceItem = [];
					var reviewedAmbienceItem = {};
					_.each(ambienceList, function (ambienceItem, key, obj) {
						if(key === 'ambience-overall' || key === 'ambience-null') {
							return;
						}
						ambienceItem.max_sentiments = max_sentiments.total_sentiments;
						if (ambienceItem.total_sentiments) {
							reviewedAmbienceItem[key] = ambienceItem;
						} else {
							notReviewedAmbienceItem.push(key);
						};
					});
					return { filtered: reviewedAmbienceItem, notReviewed: notReviewedAmbienceItem };
				},
				'service-items': function () {
					var serviceList = this.model.get('service');
					var max_sentiments = _.max(serviceList, function (serviceItem) { return serviceItem.total_sentiments; })
					var notReviewedServiceItem = [];
					var reviewedServiceItem = {};
					_.each(serviceList, function (serviceItem, key, obj) {
						if(key === 'service-overall' || key === 'service-null') {
							return;
						}
						serviceItem.max_sentiments = max_sentiments.total_sentiments;
						if (serviceItem.total_sentiments) {
							reviewedServiceItem[key] = serviceItem;
						} else {
							notReviewedServiceItem.push(key);
						};
					});
					return { filtered: reviewedServiceItem, notReviewed: notReviewedServiceItem };
				},
				'cost-items': function () {
					var costList = this.model.get('cost');
					var max_sentiments = _.max(costList, function (costItem) { return costItem.total_sentiments; })
					var notReviewedcostItem = [];
					var reviewedcostItem = {};
					_.each(costList, function (costItem, key, obj) {
						if(key === 'cost-overall' || key === 'cost-null') {
							return;
						}
						costItem.max_sentiments = max_sentiments.total_sentiments;
						if (costItem.total_sentiments) {
							reviewedcostItem[key] = costItem;
						} else {
							notReviewedcostItem.push(key);
						};
					});
					return { filtered: reviewedcostItem, notReviewed: notReviewedcostItem };
				},
				'food-items': function () {
					var foodList = this.model.get('food');
					var max_sentiments = parseInt(foodList[0].total_sentiments);
					foodList = _.each(foodList, function (foodItem, key, obj) {
						foodItem.max_sentiments = max_sentiments;
					});
					return foodList;
				},
			}
		},
		onShow: function () {
			var self = this;
			require(['tabs', 'collapsible', 'leanModal', 'materialbox'], function () {
				self.ui.tabs.tabs();
				self.ui.ambienceOverview.collapsible();
				self.ui.serviceOverview.collapsible();
				self.ui.foodOverview.collapsible();
				self.ui.addDishModalOpenBtn.leanModal();
				$('.materialboxed').materialbox();
			});

			this.reviewsRegion = new Marionette.Region({
				el: '.reviews-list-wrapper'
			});
			var id= this.model.get('__eatery_id');
			this.reviewsService.fetchRestaurantReviews(id)
				.then(function(reviews_list) {
					self.reviewsView= new ReviewsView({ reviews: reviews_list });
					self.reviewsRegion.show(self.reviewsView);
				}, function(err) {
					console.log(err);
				});
			this.$el.parent().removeClass('hide');
		},
		closeDetails: function (e) {
			e.preventDefault();
			this.$el.parent().addClass('hide');
			this.remove();
		},
		writeReview: function(e) {
			var self= this;
			e.preventDefault();

			if(this.user.isAuthorized()) {
				var reviewText= this.ui.reviewsBox.val();
				this.reviewsService.writeRestaurantReview(this.model.get('__eatery_id'), this.model.get('eatery_name'), reviewText, this.user.get('id'), this.user.get('name')).then(function(result) {
						self.ui.reviewsBox.val('');
						console.log(result);
						self.reviewsView.addReview(result.object);
						require(['toasts'], function() {
							Materialize.toast('Thank you for Submitting Review.');
						});
					}, function(err) {
						require(['toasts'], function() {
							Materialize.toast(err);
						})
					});
			} else {
				require(['toasts'], function() {
					Materialize.toast('Please log in to write Reviews');
				})
			}
		},
		ambienceItemSentimentUpdate: function(e) {
			e.preventDefault();

		},
	});
	return DetailView;
});