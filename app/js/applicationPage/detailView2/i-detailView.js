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

	function makeNvJson(input) {

		function toTitleCase(str) {
			return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
		}

		var output = [
			{ 'key': 'terrible', 'displayValue': 'Terrible', 'color': '#004e66', 'values': [] },
			{ 'key': 'poor', 'displayValue': 'Poor', 'color': '#004e66', 'values': [] },
			{ 'key': 'average', 'displayValue': 'Average', 'color': '#fcbe32', 'values': [] },
			{ 'key': 'mix', 'displayValue': 'Mix', 'color': '#fcbe32', 'values': [] },
			{ 'key': 'good', 'displayValue': 'Good', 'color': '#ff5f2e', 'values': [] },
			{ 'key': 'excellent', 'displayValue': 'Excellent', 'color': '#ff5f2e', 'values': [] }
		];
		_.each(input, function (single_food, i) {
			output[0].values.push({ 'label': toTitleCase(single_food.name), 'value': -1*(single_food.terrible) });
			output[1].values.push({ 'label': toTitleCase(single_food.name), 'value': -1*(single_food.poor) });
			output[2].values.push({ 'label': toTitleCase(single_food.name), 'value': 1*(single_food.average) });
			output[3].values.push({ 'label': toTitleCase(single_food.name), 'value': 1*(single_food.mix) });
			output[4].values.push({ 'label': toTitleCase(single_food.name), 'value': 1*(single_food.good) });
			output[5].values.push({ 'label': toTitleCase(single_food.name), 'value': 1*(single_food.excellent) });
			// if(single_food.terrible) {  }
			// if(single_food.poor) {  }
			// if(single_food.average) {  }
			// if(single_food.mix) {  }
			// if(single_food.good) {  }
			// if(single_food.excellent) {  }
		});
		console.log(JSON.stringify(output));
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
				'restaurant-name': this.restaurant_detail.eatery_details.eatery_name,
				'restaurant-address': this.restaurant_detail.eatery_details.eatery_address,
			}
		},
		ui: {
			'tabs': '.restaurant-details__tabs',
			'reviewBox': ".reviews-list"
		},
		makeFoodChart: function () {
			var foodData = this.model.get('food'); //food list array
			var promise= new Promise(function(resolve) {
				require(['nvd3'], function(nv) {
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
						chart.xAxis.axisLabel('Food List').axisLabelDistance(20);

						var a= document.getElementById('overview-tab');
						var b= document.getElementById('food-tab');
						a.style.display= 'none';
						b.style.display= 'block';

						d3.select('#food-graph')
							.style('height', b.getBoundingClientRect().height)
							.style('width', b.getBoundingClientRect().width)
							.datum(makeNvJson(foodData))
							.call(chart);

						a.style.display= 'block';
						b.style.display= 'none';

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
		onShow: function () {
			var self = this;
			$('.detail').removeClass('hide');
			this.makeFoodChart()
			self.ui.tabs.tabs();

			this.reviews.fetch({ method: 'POST', data: { __eatery_id: this.restaurant_detail.__eatery_id } }).then(function () {
				self.reviewsView.render();
				$(self.ui.reviewBox).html(self.reviewsView.el);
			});
		},
	});

	return DetailView;
});