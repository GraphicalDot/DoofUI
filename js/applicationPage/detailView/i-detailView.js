define(function(require) {

	"use strict";

	var $= require('jquery');
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