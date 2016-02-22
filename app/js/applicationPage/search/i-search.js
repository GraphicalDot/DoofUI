define(function (require) {
	"use strict";

	var $ = require('jquery');
	var _= require('underscore');
	var Handlebars = require('handlebars');
	var Marionette = require('marionette');
	var Template = require('text!./search.html');

	var TextSearchModel = require('./../../models/text_search');

	var SearchBox = Marionette.ItemView.extend({
		id: 'doofSearch',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.position = { lat: opts.latLng.lat, lng: opts.latLng.lng };
			this.address = opts.address;
			this.textSearchModel = new TextSearchModel();
		},
		templateHelpers: {
			address: function () {
				return this.address;
			}
		},
		ui: {
			'searchLocationBox': '#search__location',
			'searchDoofBox': '#search_doof'
		},
		events: {
			// 'click .clear_button': 'clearSearch',
			// 'click .search_button': 'instantSearch',
			'submit .search_box': 'instantSearch'
		},
		clearSearch: function (e) {
			// e.preventDefault();
			// $("#doof_search_box").val('');
      //       this.applicationChannel.trigger("show:restaurants");
			// this.triggerMethod('show:restaurants');
		},

		instantSearch: function (e) {
			e.preventDefault();
			// var searchValue= $("#doof_search_box").val();
			// this.onNullSelect(searchValue);
		},
		onCuisineSelect: function (cuisine_name) {
			var self = this;
			// if(!cuisine_name) {
			// 	this.clearSearch();
			// 	return;
			// }
			this.textSearchModel.fetch({ method: 'POST', data: { type: 'cuisine', text: cuisine_name } }).then(function () {
				console.log(self.textSearchModel);
				self.triggerMethod('show:restaurants', self.textSearchModel);
			});
		},
		onFoodSelect: function (food_name) {
			var self = this;
			// if (!food_name) {
			// 	this.clearSearch();
			// 	return;
			// }
			this.textSearchModel.fetch({ method: 'POST', data: { type: 'dish', text: food_name } }).then(function () {
				self.triggerMethod('show:restaurants', self.textSearchModel);
			});
			// 	self.applicationChannel.trigger('show:restaurants', self.model);
			// });
		},
		onRestaurantSelect: function (restaurant_name) {
			var self = this;
			// if (!restaurant_name) {
			// 	this.clearSearch();
			// 	return;
			// }
			this.textSearchModel.fetch({ method: 'POST', data: { type: 'eatery', text: restaurant_name } }).then(function () {
				self.triggerMethod('open:restaurant', self.textSearchModel.toJSON()[0].__eatery_id, self.textSearchModel.toJSON()[0]);
			});
		},
		onNullSelect: function (value) {
			// var self = this;
			// if (!value) {
			// 	this.clearSearch();
			// 	return;
			// }
			// this.model.fetch({method: 'POST', data: {type: null, text: value}}).then(function() {
			// 	self.applicationChannel.trigger('show:restaurants', self.model);
			// });
		},
		// makeTypeaheadGeoLocatorBox: function() {
		// 	var self= this;
		// 	require(['google-map-loader', "typeahead"], function(GoogleMapLoader) {
		// 		GoogleMapLoader.done(function (GoogleMaps) {
		// 			var geoCoder= new GoogleMaps.Geocoder;
		// 			self.ui.searchLocationBox.typeahead(
		// 				{ hint: true, highlight: true },
		// 				{
		// 					name: 'google',
		// 					source: function(q, syncResults, asyncResults) {
		// 						geoCoder.geocode({address: q}, function(results, status) {
		// 							var retVal= _.map(results, function(result) {
		// 								return result.formatted_address;
		// 							});
		// 							asyncResults(retVal);
		// 						});
		// 					},
		// 				}
		// 			);
		// 		});
		// 	});
		// },
		makeGeoLocatorBox: function () {
			var self= this;
			require(['google-map-loader'], function (GoogleMapLoader) {
				GoogleMapLoader.done(function (GoogleMaps) {
					var input = document.getElementById("search__location");
					var autoComplete = new GoogleMaps.places.Autocomplete(input);
					autoComplete.addListener('place_changed', function () {
						var place = autoComplete.getPlace();
						if (!place.geometry) { return; }
						if (place.geometry.location) {
							self.position.lat = place.geometry.location.lat();
							self.position.lng = place.geometry.location.lng();
							self.triggerMethod('update:location', self.position);
						}
					});
				});
			});
		},
		makeSuggestionBox: function () {
			var self = this;
			require(["typeahead"], function () {
				self.ui.searchDoofBox.typeahead(
					{ hint: true, highlight: true, minLength: 4 },
					{
						limit: 10,
						name: 'food',
						async: true,
						source: function (query, processSync, processAsync) {
							return $.ajax({
								url: "http://52.76.176.188:8000/suggestions",
								type: 'POST',
								data: { query: query },
								dataType: 'json',
								success: function (json) {
									return processAsync(json.result[0].suggestions)
								}
							});
						},
						templates: {
							notFound: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No dish found', '</div>'].join('\n'),
							suggestion: function (data) {
								var str = data.replace(/\s+/g, '');
								return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
							},
							header: '<div class="search-header search-header__food"><i class="material-icons suggestion-type typeahead-header food">kitchen</i><span>Dishes</span></div>'
						}
					}, {
						limit: 10,
						name: 'restaurant',
						async: true,
						source: function (query, processSync, processAsync) {
							return $.ajax({
								url: "http://52.76.176.188:8000/suggestions",
								type: 'POST',
								data: { query: query },
								dataType: 'json',
								success: function (json) {
									return processAsync(json.result[1].suggestions)
								}
							});
						},
						templates: {
							notFound: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No Restaurant found', '</div>'].join('\n'),
							suggestion: function (data) {
								var str = data.replace(/\s+/g, '');
								return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
							},
							header: '<div class="search-header search-header__restaurant"><i class="material-icons suggestion-type typeahead-header restaurant">store_mall_directory</i><span>Restaurant</span></div>'
						}
					}, {
						limit: 10,
						name: 'cuisine',
						async: true,
						source: function (query, processSync, processAsync) {
							return $.ajax({
								url: "http://52.76.176.188:8000/suggestions",
								type: 'POST',
								data: { query: query },
								dataType: 'json',
								success: function (json) {
									return processAsync(json.result[2].suggestions)
								}
							});
						},
						templates: {
							notFound: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No Cuisines found', '</div>'].join('\n'),
							suggestion: function (data) {
								var str = data.replace(/\s+/g, '');
								return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
							},
							header: '<div class="search-header search-header__cuisine"><i class="material-icons suggestion-type typeahead-header cuisine">local_dining</i><span>Cuisines</span></div>'
						}
					}
					).on('typeahead:asyncrequest', function () {
						$('.Typeahead-spinner').show();
					}).on('typeahead:asynccancel typeahead:asyncreceive', function () {
						$('.Typeahead-spinner').hide();
					});

				self.ui.searchDoofBox.bind("typeahead:select", function (ev, suggestion) {
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

				self.ui.searchDoofBox.enterKey(function (e) {
					if ($(this).val()) {
						self.onNullSelect($(this).val());
					} else {
						self.clearSearch();
					}
				});
			});
		},
		onShow: function () {
			this.makeGeoLocatorBox();
			this.makeSuggestionBox();
		}
	});

	return SearchBox;
});