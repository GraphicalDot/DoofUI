define(function (require) {

	"use strict";

	var $ = require('jquery');

	var Typeahead = require('typeahead');
	var Handlebars = require('handlebars');
	var Marionette = require('backbone.marionette');
	var Template = require('text!./facets.html');

	var Food = require('./../../models/foods');
	var TextSearch= require('./../../models/textsearch');

	var SUGGESTION_LIMIT = 20;

	var FacetsView = Marionette.ItemView.extend({
		className: 'facets-row',
		template: Handlebars.compile(Template),
		initialize: function () {
			this.food = new Food();
			this.textSearch= new TextSearch();
		},
		events: {
			'click .closebutton': 'clearSearch'
		},
		clearSearch: function () {
			$("#food_restaurant_search").val('');
			this.triggerMethod('show:restaurants');
		},
		onCuisineSelect: function(cuisine_name) {
			var self = this;
			if (!cuisine_name) {
				self.triggerMethod('show:restaurants');
				return;
			}
			this.textSearch.fetch({method: 'POST', data: {type: 'cuisine', text: cuisine_name}}).then(function() {
				self.triggerMethod('show:restaurants', self.textSearch);
			});
		},
		// Show Restaurant Information on Selection of restaurant.
		// Question -> What to do in case of Subway.
		onRestaurantSelect: function (restaurant_name) {
			var self = this;
			if (!restaurant_name) {
				self.triggerMethod('show:restaurant');
				return;
			}
			this.textSearch.fetch({method: 'POST', data: {type: 'eatery', text: restaurant_name}}).then(function() {
				self.triggerMethod('show:restaurant', self.textSearch);
			});
		},
		// On food select, display restaurants which are giving that dish.
		onFoodSelect: function (food_name) {
			var self = this;
			if (!food_name) {
				self.triggerMethod('show:restaurants');
				return;
			}
			this.textSearch.fetch({method: 'POST', data: {type: 'dish', text: food_name}}).then(function() {
				self.triggerMethod('show:restaurants', self.textSearch);
			});
		},
		onShow: function () {
			var self= this;
			$("#food_restaurant_search").typeahead({
				hint: true, highlight: true, minLength: 4
			}, {
					limit: SUGGESTION_LIMIT,
					async: true,
					source: function (query, processSync, processAsync) {
						return $.ajax({
							url: window.get_suggestions,
							type: 'POST',
							data: { query: query },
							dataType: 'json',
							success: function (json) {
								return processAsync(json.result[0].suggestions)
							}
						});
					},
					templates: {
						empty: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No food found', '</div>'].join('\n'),
						suggestion: function (data) {
							var str = data.replace(/\s+/g, '');
							return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
						},
						header: '<i class="material-icons suggestion-type typeahead-header food">kitchen</i><span>Food</span>'
					}
				}, {
					limit: SUGGESTION_LIMIT,
					async: true,
					source: function (query, processSync, processAsync) {
						return $.ajax({
							url: window.get_suggestions,
							type: 'POST',
							data: { query: query },
							dataType: 'json',
							success: function (json) {
								return processAsync(json.result[1].suggestions)
							}
						});
					},
					templates: {
						empty: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No Restaurant found', '</div>'].join('\n'),
						suggestion: function (data) {
							var str = data.replace(/\s+/g, '');
							return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
						},
						header: '<i class="material-icons suggestion-type typeahead-header restaurant">kitchen</i><span>Restaurant</span>'
					}
				}, {
					limit: SUGGESTION_LIMIT,
					async: true,
					source: function (query, processSync, processAsync) {
						return $.ajax({
							url: window.get_suggestions,
							type: 'POST',
							data: { query: query },
							dataType: 'json',
							success: function (json) {
								return processAsync(json.result[2].suggestions)
							}
						});
					},
					templates: {
						empty: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No Cuisines found', '</div>'].join('\n'),
						suggestion: function (data) {
							var str = data.replace(/\s+/g, '');
							return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
						},
						header: '<i class="material-icons suggestion-type typeahead-header cuisine">kitchen</i><span>Cuisines</span>'
					}
				}).on('typeahead:asyncrequest', function () {
					$('.Typeahead-spinner').show();
				}).on('typeahead:asynccancel typeahead:asyncreceive', function () {
					$('.Typeahead-spinner').hide();
				});

			$("#food_restaurant_search").bind("typeahead:select", function (ev, suggestion) {

				var str = suggestion.replace(/\s+/g, '');

				var $suggestionEl = $('.typeahead-suggestion-' + str);
				var $headerEl = $suggestionEl.closest('.tt-dataset').find('.typeahead-header');

				if ($headerEl.hasClass('food')) {
					self.onFoodSelect(suggestion);
				} else if ($headerEl.hasClass('cuisine')) {
					self.onCuisineSelect(suggestion);
				} else {
					self.onRestaurantSelect(suggestion);
				}
			});

			$("#food_restaurant_search").enterKey(function (e) {
				if ($(this).val()) {
					self.onNullSelect($(this).val());
				} else {
					self.clearSearch();
				}
			});
		}
	});

	return FacetsView;
})