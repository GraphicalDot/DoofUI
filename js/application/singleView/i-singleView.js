define(function (require) {
	'use strict';

	var _ = require('underscore');
	var Handlebars = require('handlebars');
	var Marionette = require('backbone.marionette');

	var Template = require('text!./singleView.html');

	function json_convertor(json_data) {
		var op = [];
		var series = ["excellent", "good", "average", "poor", "terrible"];
		series.reverse();
		series.forEach(function (emotion, j) {
			var obj = {};
			obj.key = emotion;
			obj.values = [];
			json_data.forEach(function (d, i) {
				var sub_obj = {};
				sub_obj.label = d.name;
				if (emotion === "poor" || emotion === "terrible") {
					sub_obj.value = -d[emotion];
				} else {
					sub_obj.value = d[emotion];
				}
				obj.values.push(sub_obj);
			});
			op.push(obj);
		});
		return op;
		console.log(op);
	}

	return Marionette.ItemView.extend({
		initialize: function (opts) {
			this.name = opts.eatery_name;
			this.details= opts.restaurant_info.eatery_details;
		},
		template: Handlebars.compile(Template),
		templateHelpers: function () {
			var self = this;
			return {
				name: self.details.eatery_name,
				address: self.details.eatery_address
			};
		},
		onShow: function () {
			this.makeD3Chart();
			$('.single-content').removeClass('hide');
		},
		createTab: function () {
			$('ul.tabs').tabs();
		},
		events: {
			'click #detail-close i': 'closeIt'
		},
		closeIt: function(e) {
			e.preventDefault();
			this.remove();
			$('.single-content').addClass('hide');
		},
		createGraph: function (dataset, domId) {
			require(['nvd3'], function (nv) {
				var chart;
				window.nv.addGraph(function () {
					chart = window.nv.models.multiBarHorizontalChart()
						.x(function (d) { return d.label })
						.y(function (d) { return d.value })
					// .yErr(function (d) { return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] })
						.barColor(d3.scale.category20().range())
						.duration(250)
						.margin({ top: 30, right: 20, bottom: 50, left: 100 })
						.groupSpacing(0.6)
						.showControls(false)
						.noData("Nothing to show here")
						.barColor(function(d, i) {
			if(d.key=== "terrible") {return "rgb(214, 39, 40)"}
			if(d.key=== "poor") {return "rgb(200, 70, 70)"}
			if(d.key=== "average") {return "yellow"}
			if(d.key=== "good") {return "rgb(152, 223, 138)"}
			if(d.key=== "excellent") {return "rgb(30, 112, 30)"}
		})
		.color(function(d, i) {
			if(d.key=== "terrible") {return "rgb(214, 39, 40)"}
			if(d.key=== "poor") {return "steelblue"}
			if(d.key=== "average") {return "yellow"}
			if(d.key=== "good") {return "rgb(152, 223, 138)"}
			if(d.key=== "excellent") {return "rgb(30, 112, 30)"}
		})
						.stacked(true);

					chart.yAxis.tickFormat(d3.format(',.2f'));

					chart.yAxis.axisLabel('Total Number of Reviews');
					// chart.xAxis.axisLabel('X Axis').axisLabelDistance(20);


					d3.select(domId)
						.datum(json_convertor(dataset))
						.call(chart);

					window.nv.utils.windowResize(chart.update);

					chart.dispatch.on('stateChange', function (e) { window.nv.log('New State:', JSON.stringify(e)); });
					chart.state.dispatch.on('change', function (state) {
						window.nv.log('state', JSON.stringify(state));
					});
					return chart;
				});
			})
		},
		makeD3Chart: function () {
			var model = this.model.toJSON();
			var self= this;
			// var keys = ['ambience', 'cost', 'food', 'service', 'menu'];
			var keys = ['ambience', 'food', 'service', 'cost'];
			_.each(keys, function (key, i) {
				var current_key = key, key_data = model[current_key];

				if (current_key === 'food') {
					self.createGraph(key_data, '#'+current_key+'-graph');
				} else if (current_key === 'menu') { } else {
					var temp_array = [];
					for (var key in key_data) {
						var current_data = key_data[key];
						current_data.name = key;
						temp_array.push(current_data);
					}

					self.createGraph(temp_array, '#'+current_key+'-graph');
					// d3BubbleGraph(temp_array, current_key);
				}
			})
			this.createTab();
		}
	});
});