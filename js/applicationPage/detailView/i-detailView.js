define(function(require) {

	"use strict";

	var $= require('jquery');
	var _ = require('underscore');
	var Handlebars = require('handlebars');
	var Marionette = require('marionette');
	var Template = require('text!./detailView.html');

	var d3= require('d3');

	return Marionette.ItemView.extend({
		id: 'detail-view',
		template: Handlebars.compile(Template),
		initialize: function(opts) {
			this.restaurant_detail= opts.restaurant_detail;
		},
		makeCharts: function() {

			function json_maker(input) {
				var output= [];

				var categories= ['terrible', 'poor', 'average', 'mix', 'good', 'excellent'];
				_.each(categories, function(category) {
					var obj= {key: category, color: 'red', values: []};
					output.push(obj);
				});
				//in food case, we get an array
				if(Array.isArray(input)) {
					_.each(input, function(key) {
						var dataSet= key;
						output[0].values.append({"label": key, value: dataSet.terrible});
						output[1].values.append({"label": key, value: dataSet.poor});
						output[2].values.append({"label": key, value: dataSet.average});
						output[3].values.append({"label": key, value: dataSet.mix});
						output[4].values.append({"label": key, value: dataSet.good});
						output[5].values.append({"label": key, value: dataSet.excellent});
					});
				}
				else {
					for(var key in input) {
						if(input.hasOwnProperty(key)) {
							var dataSet= input[key];
							output[0].values.append({"label": key, value: dataSet.terrible});
							output[1].values.append({"label": key, value: dataSet.poor});
							output[2].values.append({"label": key, value: dataSet.average});
							output[3].values.append({"label": key, value: dataSet.mix});
							output[4].values.append({"label": key, value: dataSet.good});
							output[5].values.append({"label": key, value: dataSet.excellent});
						}
					}
				}
				return output;
			}

			require(['nvd3'], function(nv) {
				window.nv.addGraph(function() {
					self.chart= window.nv.models.multiBarHorizontalChart()
						.x(function(d) {return d.label})
						.y(function(d) {return d.value})
						.duration(250)
						.margin({top: 30, right: 20, bottom: 40, left: 120})
						.groupSpacing(0.818)
						.showControls(false)
						.stacked(true);

					self.chart.yAxis.axisLabel('Total number of Sentiments');
					d3.select('domEl')
						.datum(data)
						.call(self.chart);

					window.nv.utils.windowResize(self.chart.update);
				});
			});
		},
		onShow: function () {
			$('ul.tabs').tabs();
			// this.makeCharts();
			$('.detail').removeClass('hide');
		}
	});
});