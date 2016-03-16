/*
 * This View opens Single Restaurant Detail Card.
 * Here, we show Restaurant Details, Food and its Reviews.
 * Input : Restaurant_ID
 * APIS used : Get Restaurant-Details,
 *
*/
define(function (require) {
	'use strict';

	var $ = require('jquery');
	var _ = require('underscore');

	var d3 = require('d3');
	var Promise = require('es6promise').Promise;

	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./detailView.html');

	var ReviewsCollection = require('./../../models/fetch_review');
	var ReviewsView = require('./../reviewsView/i-reviews');

	Handlebars.registerHelper('positivity', function (opts) {
		if (opts.excellent > opts.good) {
			return '<i class="material-icons">sentiment_very_satisfied</i><span>' + opts.excellent + opts.good + '</span>'
		} else {
			return '<i class="material-icons">sentiment_satisfied</i><span>' + opts.excellent + opts.good + '</span>'
		}
	});

	function escapedHtml(text) {
		return text
      .replace(/&amp;/g, '&');
	}

	function makeNvJson(input) {

		function toTitleCase(str) {
			if (str) {
				return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
			} else {
				return str;
			}
		}

		var output = [
			{ 'key': 'terrible', 'displayValue': 'Terrible', 'color': '#004e66', 'values': [] },
			{ 'key': 'poor', 'displayValue': 'Poor', 'color': '#647a51', 'values': [] },
			{ 'key': 'average', 'displayValue': 'Average', 'color': '#c9a73c', 'values': [] },
			{ 'key': 'mix', 'displayValue': 'Mix', 'color': '#fcab31', 'values': [] },
			{ 'key': 'good', 'displayValue': 'Good', 'color': '#fd852f', 'values': [] },
			{ 'key': 'excellent', 'displayValue': 'Excellent', 'color': '#ff5f2e', 'values': [] }
		];
		_.each(input, function (single_food, i) {
			output[0].values.push({ 'label': toTitleCase(single_food.name ? single_food.name : i), 'value': parseInt(single_food.terrible) });
			output[1].values.push({ 'label': toTitleCase(single_food.name ? single_food.name : i), 'value': parseInt(single_food.poor) });
			output[2].values.push({ 'label': toTitleCase(single_food.name ? single_food.name : i), 'value': parseInt(single_food.average) });
			output[3].values.push({ 'label': toTitleCase(single_food.name ? single_food.name : i), 'value': parseInt(single_food.mix ? single_food.mix : 0) });
			output[4].values.push({ 'label': toTitleCase(single_food.name ? single_food.name : i), 'value': parseInt(single_food.good) });
			output[5].values.push({ 'label': toTitleCase(single_food.name ? single_food.name : i), 'value': parseInt(single_food.excellent) });
		});
		return output;
	}

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
				'restaurant-name': this.restaurant_detail.eatery_details ? escapedHtml(this.restaurant_detail.eatery_details.eatery_name) : '',
				'restaurant-address': this.restaurant_detail.eatery_details ? escapedHtml(this.restaurant_detail.eatery_details.eatery_address) : '',
				'reviews-length': this.reviews.length,
				'restaurant-overall-rating': function () {
					var restaurant_sentiments = this.model.get('overall');
					var terrible= parseInt(restaurant_sentiments.terrible) ? parseInt(restaurant_sentiments.terrible) : 0;
					var poor= parseInt(restaurant_sentiments.poor) ? parseInt(restaurant_sentiments.poor) : 0;
					var average= parseInt(restaurant_sentiments.average) ? parseInt(restaurant_sentiments.average) : 0;
					var mix= parseInt(restaurant_sentiments.mix) ? parseInt(restaurant_sentiments.mix) : 0;
					var good= parseInt(restaurant_sentiments.good) ? parseInt(restaurant_sentiments.good) : 0;
					var excellent= parseInt(restaurant_sentiments.excellent) ? parseInt(restaurant_sentiments.excellent) : 0;
					var total_sentiments= parseInt(restaurant_sentiments.total_sentiments) ? parseInt(restaurant_sentiments.total_sentiments) : 0;
					return ((0 * terrible + 2.5 * poor + 4.8 * average + 5.2 * mix + 7.5 * good + 10 * excellent) / total_sentiments).toFixed(1);
				},
				'restaurant-star-ratings': function () {
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
			}
		},
		ui: {
			'tabs': '.restaurant-details__tabs',
			'reviewBox': ".reviews-list",
			'closeButton': '.detail-close',
			'prevSlideArrow': '.slider__left-arrow',
			'nextSlideArrow': '.slider__right-arrow',
		},
		events: {
			'click @ui.closeButton': 'closeIt',
			'click @ui.prevSlideArrow': 'previousPhoto',
			'click @ui.nextSlideArrow': 'nextPhoto'
		},
		closeIt: function (e) {
			e.preventDefault();
			this.remove();
			$('.body__detail-box').addClass('hide');
		},
		previousPhoto: function (e) {
			// e.preventDefault();
			$('.slider').slider('prev');
		},
		nextPhoto: function (e) {
			// e.preventDefault();
			$('.slider').slider('next');
		},
		makeFoodChart: function () {
			var foodData = this.model.get('food'); //food list array
			var promise = new Promise(function (resolve) {
				require(['nvd3'], function (nv) {
					window.nv.addGraph(function () {
						var chart;
						chart = window.nv.models.multiBarHorizontalChart()
							.x(function (d) { return d.label })
							.y(function (d) { return d.value })
							.duration(250)
							.margin({ top: 30, right: 20, bottom: 40, left: 120 })
							.groupSpacing(0.818)
							.showControls(false)
							.stacked(true);
						chart.yAxis.axisLabel('Total Sentiments');
						// chart.xAxis.axisLabel('Food List');

						var a = document.getElementById('overview-tab');
						var b = document.getElementById('food-tab');
						a.style.display = 'none';
						b.style.display = 'block';

						d3.select('#food-graph')
							.style('height', b.getBoundingClientRect().height)
							.style('width', b.getBoundingClientRect().width)
							.datum(makeNvJson(foodData))
							.call(chart);

						a.style.display = 'block';
						b.style.display = 'none';

						window.nv.utils.windowResize(chart.update);
						chart.dispatch.on('stateChange', function (e) { window.nv.log('New State:', JSON.stringify(e)); });
						chart.state.dispatch.on('change', function (state) {
							window.nv.log('state', JSON.stringify(state));
						});
						resolve();
					});
				});
			});
			return promise;
		},
		drawChart: function (data, domEl) {
			require(['nvd3'], function (nv) {
				window.nv.addGraph(function () {
					var chart;
					chart = window.nv.models.multiBarHorizontalChart()
						.x(function (d) { return d.label })
						.y(function (d) { return d.value })
						.duration(250)
						.margin({ top: 30, right: 20, bottom: 40, left: 120 })
						.groupSpacing(0.818)
						.showControls(false)
						.stacked(true);
					chart.yAxis.axisLabel('Total Sentiments');
					// chart.xAxis.axisLabel('Food List');

					var a = document.getElementById('overview-tab');
					var b = document.getElementById(domEl + '-tab');
					a.style.display = 'none';
					b.style.display = 'block';

					d3.select('#' + domEl + '-graph')
						.style('height', b.getBoundingClientRect().height)
						.style('width', b.getBoundingClientRect().width)
						.datum(makeNvJson(data))
						.call(chart);

					a.style.display = 'block';
					b.style.display = 'none';

					window.nv.utils.windowResize(chart.update);
					chart.dispatch.on('stateChange', function (e) { window.nv.log('New State:', JSON.stringify(e)); });
					chart.state.dispatch.on('change', function (state) {
						window.nv.log('state', JSON.stringify(state));
					});
				});
			});
		},
		makeAmbienceChart: function () {
			var ambienceData = this.model.get('ambience');
			this.drawChart(ambienceData, 'ambience');
		},
		makeCostChart: function () {
			var costData = this.model.get('cost');
			this.drawChart(costData, 'cost');
		},
		makeServiceChart: function () {
			var serviceData = this.model.get('service');
			this.drawChart(serviceData, 'service');
		},
		onShow: function () {
			var self = this;
			$('.body__detail-box').removeClass('hide');
			$('.slider').slider({ full_width: true, height: 240, indicators: false });
			$('.materialboxed').materialbox();
			this.makeFoodChart();
			this.makeAmbienceChart();
			this.makeServiceChart();
			this.makeCostChart();
			self.ui.tabs.tabs();
			$('.collapsible').collapsible();

			this.reviews.fetch({ method: 'POST', data: { __eatery_id: this.restaurant_detail.__eatery_id } }).then(function () {
				self.reviewsView.render();
				$(self.ui.reviewBox).html(self.reviewsView.el);
			});
		},
	});

	return DetailView;
});