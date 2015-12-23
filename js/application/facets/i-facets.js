define(function (require) {

	"use strict";

	var $ = require('jquery');
	var Handlebars = require('handlebars');
	var Marionette = require('backbone.marionette');
	var Template = require('text!./facets.html');

	var Food = require('./../../models/foods');

	var FacetsView = Marionette.ItemView.extend({
		className: 'facets-row',
		template: Handlebars.compile(Template),
		initialize: function () {
			this.food = new Food();
		},
		onShow: function () {
			$("#food_restaurant_search").typeahead(
				{ hint: true, highlight: true, minLength: 4 },
				{
					limit: 12,
					async: true,
					source: function (query, processSync, processAsync) {
						return $.ajax({
							url: window.get_dish_suggestions,
							type: 'GET',
							data: { query: query },
							dataType: 'json',
							success: function (json) {
								return processAsync(json.options);
							}
						});
					},
					templates: {
						empty: ['<div class="empty-message">', 'No food found', '</div>'].join('\n'),
						suggestion: function (data) {
							var str = data.replace(/\s+/g, '');
							return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
						},
						header: '<i class="material-icons suggestion-type typeahead-header food">search</i><span>Food</span>'
					}
				},
				{
					limit: 12,
					async: true,
					source: function (query, processSync, processAsync) {
						return $.ajax({
							url: window.get_eatery_suggestions,
							type: 'GET',
							data: { query: query },
							dataType: 'json',
							success: function (json) {
								return processAsync(json.options);
							}
						});
					},
					templates: {
						empty: ['<div class="empty-message">', 'No restaurant found', '</div>'].join('\n'),
						suggestion: function (data) {
							var str = data.replace(/\s+/g, '');
							return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
						},
						header: '<i class="material-icons suggestion-type typeahead-header restaurant-s">trending_up</i><span>Restaurants</span>'
					}
				}
				).on('typeahead:asyncrequest', function () {
					$('.Typeahead-spinner').show();
				}).on('typeahead:asynccancel typeahead:asyncreceive', function () {
					$('.Typeahead-spinner').hide();
				});
		}
	});

	return FacetsView;
})