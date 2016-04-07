define(function (require) {
	'use strict';

	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');

	$.fn.enterKey = function (fnc) {
		return this.each(function () {
			$(this).keypress(function (ev) {
				var keycode = (ev.keyCode ? ev.keyCode : ev.which);
				if (keycode == '13') {
					fnc.call(this, ev);
				}
			});
		});
	}

	// extra code to add template helper functionality to marionnete view.
	Backbone.Marionette.ItemView.prototype.mixinTemplateHelpers = function (target) {
		var self = this;
		var templateHelpers = Marionette.getOption(self, "templateHelpers");
		var result = {};

		target = target || {};

		if (_.isFunction(templateHelpers)) {
			templateHelpers = templateHelpers.call(self);
		}

		// This _.each block is what we're adding
		_.each(templateHelpers, function (helper, index) {
			if (_.isFunction(helper)) {
				result[index] = helper.call(self);
			} else {
				result[index] = helper;
			}
		});

		return _.extend(target, result);
	};

	Handlebars.registerHelper("escaped", function (something) {
		function escapeHtml(text) {
			return text
				.replace(/&amp;/g, '&');
		}
		return escapeHtml(something);
	});

	Handlebars.registerHelper('undasherized-text', function (opts) {
		function toTitleCase(str) {
			if (str) {
				return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }).replace(/-/g, ' ');
			} else {
				return str;
			}
		}
		return toTitleCase(opts.fn(this));
	});

	Handlebars.registerHelper('math', function (lValue, operator, rValue, opts) {
		lValue = parseFloat(lValue) ? parseFloat(lValue) : 0;
		rValue = parseFloat(rValue) ? parseFloat(rValue) : 0;
		if (operator === "+") {
			return lValue + rValue;
		}
	});

	Handlebars.registerHelper('line_graph', function (obj) {
		var ratio = obj.total_sentiments / obj.max_sentiments;
		return (ratio * 100).toFixed(2) + '%';
	});

	Handlebars.registerHelper('line_graph_color', function (obj) {
		var negative_sentiments = obj.poor + obj.terrible;
		var positive_sentiments = obj.excellent + obj.good;
		var neutral_sentiments = obj.average + (obj.mix ? obj.mix : 0);
		console.log(negative_sentiments, positive_sentiments, neutral_sentiments);
		if (positive_sentiments >= neutral_sentiments && positive_sentiments >= negative_sentiments) {
			return '#4caf50';
		} else if (neutral_sentiments >= positive_sentiments && neutral_sentiments >= negative_sentiments) {
			return '#2196f3';
		} else {
			return '#f44336';
		}
	});

	Handlebars.registerHelper('line_graph_html', function (obj) {
		console.log(obj);
		var negative_sentiments = obj.poor + obj.terrible;
		var positive_sentiments = obj.excellent + obj.good;
		var neutral_sentiments = obj.average + (obj.mix ? obj.mix : 0);

		function getRatio(item1, item2) {
			var ratio = item1 / item2;
			return (ratio * 100).toFixed(2);
		}

		// <div class="determinate" style="width: {{line_graph this}}; background-color: {{line_graph_color this}}"></div>
		var negative_line = '<div class="determinate negative-line" style="width: ' + getRatio(negative_sentiments, obj.max_sentiments) + '%; left: 0; background-color: #eb7575"></div>';
		var neutral_line = '<div class="determinate neutral-line" style="width: ' + getRatio(neutral_sentiments, obj.max_sentiments) + '%; left: ' + getRatio(negative_sentiments, obj.max_sentiments) + '%;background-color: #fadb7d"></div>';
		var positive_line = '<div class="determinate positive-line" style="width: ' + getRatio(positive_sentiments, obj.max_sentiments) + '%; left: ' + (getRatio(neutral_sentiments + negative_sentiments, obj.max_sentiments)) + '%;background-color: #65a877"></div>';
		return negative_line + neutral_line + positive_line;
	});

	Handlebars.registerHelper('is_highest', function (query, obj) {
		var negative_sentiments = obj.poor + obj.terrible;
		var positive_sentiments = obj.excellent + obj.good;
		var neutral_sentiments = obj.average + (obj.mix ? obj.mix : 0);
		if (query === 'happy') {
			if (positive_sentiments >= neutral_sentiments && positive_sentiments >= negative_sentiments) {
				return 'yes';
			}
		} else if (query === 'neutral') {
			if (neutral_sentiments >= positive_sentiments && neutral_sentiments >= negative_sentiments) {
				return 'yes';
			}
		} else {
			if (negative_sentiments >= neutral_sentiments && negative_sentiments >= positive_sentiments) {
				return 'yes';
			}
		}
		return 'no';
	});

	return true;
});