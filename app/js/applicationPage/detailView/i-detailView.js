/* global Materialize */
define(function (require) {

	"use strict";

	var $ = require('jquery');
	var _ = require('underscore');
	// var Backbone = require('backbone');
	var Handlebars = require('handlebars');
	var Marionette = require('marionette');
	var Template = require('text!./detailView.html');

	var d3 = require('d3');

	var Reviews = require('./../../models/fetch_review');
	var WriteReview = require('./../../models/write_review');

	return Marionette.ItemView.extend({
		id: 'detail-view',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			// var self = this;
			this.restaurant_detail = opts.restaurant_detail;
			// var eatery_id= opts.restaurant_detail
			this.user = opts.user;
			this.reviews = new Reviews();

			var ReviewsView = require('./i-reviewslist');
			this.reviewsView = new ReviewsView({ collection: this.reviews, __eatery_id: this.restaurant_detail.__eatery_id });
		},
		ui: {
			reviewBox: ".reviews-list"
		},
		templateHelpers: function () {
			return {
				'restaurant-name': this.restaurant_detail.eatery_details ? this.restaurant_detail.eatery_details.eatery_name : this.restaurant_detail.eatery_name,
				'restaurant-address': this.restaurant_detail.eatery_details ? this.restaurant_detail.eatery_details.eatery_address : this.restaurant_detail.eatery_address,
				reviews: function () {
					return this.reviews.toJSON();
				},
			}
		},
		events: {
			'click .detail-close': 'closeIt',
			'click .submit-review-form': 'reviewSubmit'
		},
		closeIt: function (e) {
			e.preventDefault();
			this.remove();
			$('.detail').addClass('hide');
		},
		reviewSubmit: function (e) {
			e.preventDefault();
			var self = this;
			var review = $("#review-box").val();

			var sendReview = new WriteReview();

			if (this.user.isAuthorized()) {
				var eatery_name = this.restaurant_detail.eatery_name ? this.restaurant_detail.eatery_name : this.restaurant_detail.eatery_details.eatery_name;
				sendReview.fetch({ method: 'POST', data: { fb_id: this.user.get('id'), "review_text": review, "__eatery_id": this.restaurant_detail.__eatery_id, "eatery_name": eatery_name } }).then(function (response) {
					if (response.success) {
						$("#review-box").val('');
						self.reviews.add(response.result);
						self.reviewsView.render();
						Materialize.toast('Your review has been posted.', 4000);
					}
				});
			} else {
				Materialize.toast('Please login to submit', 4000);
			}
		},
		makeCharts: function () {

			function json_maker(input) {
				var output = [];
				var categories = [
					{ 'value': 'terrible', 'color': '#a50f15' }, { 'value': 'poor', 'color': '#de2d26' }, { 'value': 'mix', 'color': '#fb6a4a' },
					{ 'value': 'average', 'color': '#74c476' }, { 'value': 'good', 'color': '#31a354' }, { 'value': 'excellent', 'color': '#006d2c' }];
				categories.forEach(function (category) {
					var obj = { key: category.value, color: category.color, values: [] };
					output.push(obj);
				});
				//in food case, we get an array
				if (Array.isArray(input)) {
					input.forEach(function (key) {
						var dataSet = key;
						output[0].values.push({ "label": dataSet.name, value: -dataSet.terrible ? -dataSet.terrible : 0, total: dataSet.total_sentiments });
						output[1].values.push({ "label": dataSet.name, value: -dataSet.poor ? -dataSet.poor : 0, total: dataSet.total_sentiments });
						output[2].values.push({ "label": dataSet.name, value: +dataSet.mix ? +dataSet.mix : 0, total: dataSet.total_sentiments });
						output[3].values.push({ "label": dataSet.name, value: +dataSet.average ? +dataSet.average : 0, total: dataSet.total_sentiments });
						output[4].values.push({ "label": dataSet.name, value: +dataSet.good ? +dataSet.good : 0, total: dataSet.total_sentiments });
						output[5].values.push({ "label": dataSet.name, value: +dataSet.excellent ? +dataSet.excellent : 0, total: dataSet.total_sentiments });
					});
				}
				else {
					for (var key in input) {
						if (input.hasOwnProperty(key)) {
							var dataSet = input[key];
							output[0].values.push({ "label": key, value: -dataSet.terrible ? -dataSet.terrible : 0, total: dataSet.total_sentiments });
							output[1].values.push({ "label": key, value: -dataSet.poor ? -dataSet.poor : 0, total: dataSet.total_sentiments });
							output[2].values.push({ "label": key, value: +dataSet.mix ? +dataSet.mix : 0, total: dataSet.total_sentiments });
							output[3].values.push({ "label": key, value: +dataSet.average ? +dataSet.average : 0, total: dataSet.total_sentiments });
							output[4].values.push({ "label": key, value: +dataSet.good ? +dataSet.good : 0, total: dataSet.total_sentiments });
							output[5].values.push({ "label": key, value: +dataSet.excellent ? +dataSet.excellent : 0, total: dataSet.total_sentiments });
						}
					}
				}
				return output;
			}

			var keys = ['ambience', 'food', 'cost', 'service'];
			var data = this.model.toJSON();
			_.each(keys, function (key) {
				require(['nvd3'], function (nv) {
					window.nv.addGraph(function () {
						self.chart = window.nv.models.multiBarHorizontalChart()
							.x(function (d) { return d.label })
							.y(function (d) { return d.value })
							.duration(250)
							.margin({ top: 30, right: 20, bottom: 40, left: 120 })
							.groupSpacing(0.818)
							.showControls(false)
							.stacked(true);

						self.chart.yAxis.axisLabel('Total number of Sentiments');

						d3.select('svg#' + key)
							.datum(json_maker(data[key]))
							.call(self.chart);

						window.nv.utils.windowResize(self.chart.update);
					});
				});
			});

		},
		onDomRefresh: function () {

		},
		onShow: function () {
			var self = this;
			$('ul.detail_tabs').tabs();
			$('.addFoodItemBtn').leanModal();
			this.makeCharts();
			$('.detail').removeClass('hide');

			this.reviews.fetch({ method: 'POST', data: { __eatery_id: this.restaurant_detail.__eatery_id } }).then(function () {
				self.reviewsView.render();
				$(self.ui.reviewBox).html(self.reviewsView.el);
			});
		}
	});
});