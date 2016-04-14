define(function (require) {
	'use strict';

	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./searchBox.html');

	var TextSearchService = require('./../../services/text-search-service');

	var SearchBoxView = Marionette.ItemView.extend({
		id: 'doofSearch',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.place = opts.place;
			this.latLng = opts.latLng;
			this.googleService = opts.googleService;
			this.textService = new TextSearchService();
		},
		templateHelpers: {
			'startingAddress': function () {
				return this.place;
			}
		},
		ui: {
			'geolocatorIcon': '.location-search__geolocate-me',
			'searchLocationBox': '#search__location',
			'searchDoofBox': '#search_doof',
			'clearSearchBtn': '.clear-search__icon',
			'searchBtn': '#search__submit-btn'
		},
		events: {
			'click @ui.geolocatorIcon': 'getLocation',
			'click @ui.clearSearchBtn': 'clearSearch',
			'click @ui.searchBtn': 'search'
		},
		getLocation: function (e) {
			e.preventDefault();
			var self = this;
			function success(position) {
				self.latLng.lat = position.coords.latitude;
				self.latLng.lng = position.coords.longitude;
				self.googleService.geoCodeService(self.latLng.lat, self.latLng.lng).then(function (geoCodeResult) {
					self.place = geoCodeResult.formatted_address;
					self.ui.searchLocationBox.val(geoCodeResult.formatted_address);
					self.search();
				});
			};
			function fail() {
				console.log("soory could not get your location");
			};
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(success, fail, {});
			}
		},
		clearSearch: function (e) {
			e.preventDefault();
			this.ui.searchDoofBox.val('');
			this.search();
		},
		search: function(restaurants_list) {
			this.triggerMethod('showSearchResults', restaurants_list);
		},
		isSearchActive: function() {
			return Boolean(this.ui.searchDoofBox.val());
		},
		foodSelect: function (food_name) {
			var self = this;
			this.textService.getByFood(food_name, this.latLng.lat, this.latLng.lng).then(function (restaurants_list) {
				self.search(restaurants_list);
			});
		},
		cuisineSelect: function (cuisine_name) {
			var self = this;
			this.textService.getByCuisine(cuisine_name, this.latLng.lat, this.latLng.lng).then(function (restaurants_list) {
				self.search(restaurants_list);
			});
		},
		restaurantSelect: function (restaurant_name) {
			var self = this;
			this.textService.getByRestaurantName(restaurant_name, this.latLng.lat, this.latLng.lng).then(function (restaurants_list) {
				self.search(restaurants_list);
			});
		},
		loadTypeahead: function () {
			var self = this;
			var opts = { hint: true, highlight: true, minLength: 4 };
			require(['jquery', 'typeahead'], function ($) {
				var foodQuery = {
					name: 'food', limit: 12, async: true,
					source: function (query, processSync, processAsync) {
						self.textService.getSuggestions(query).then(function (suggestionsResult) {
							return processAsync(suggestionsResult.foodSuggestions);
						});
					},
					templates: {
						notFound: '<div class="empty-suggestion"> No Food found </div>',
						suggestion: function (data) {
							var str = data.replace(/\s+/g, '');
							return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
						},
						header: '<div class="suggestion-header food-suggestions"><i class="material-icons">kitchen</i><span>Dishes</span>'
					}
				};
				var restaurantQuery = {
					name: 'restaurant', limit: 12, async: true,
					source: function (query, processSync, processAsync) {
						self.textService.getSuggestions(query).then(function (suggestionsResult) {
							return processAsync(suggestionsResult.restaurantSuggestions);
						});
					},
					templates: {
						notFound: '<div class="empty-suggestion"> No Restaurant found </div>',
						suggestion: function (data) {
							var str = data.replace(/\s+/g, '');
							return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
						},
						header: '<div class="suggestion-header restaurant-suggestions"><i class="material-icons">store_mall_directory</i><span>Restaurants</span>'
					}
				};
				var cuisineQuery = {
					name: 'cuisine', limit: 12, async: true,
					source: function (query, processSync, processAsync) {
						self.textService.getSuggestions(query).then(function (suggestionsResult) {
							return processAsync(suggestionsResult.cuisineSuggestions);
						});
					},
					templates: {
						notFound: '<div class="empty-suggestion"> No Cuisine found </div>',
						suggestion: function (data) {
							var str = data.replace(/\s+/g, '');
							return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
						},
						header: '<div class="suggestion-header cuisine-suggestions"><i class="material-icons">local_dining</i><span>Cuisines</span>'
					}
				};
				self.ui.searchDoofBox.typeahead(opts, foodQuery, restaurantQuery, cuisineQuery)
					.on('typeahead:asyncrequest', function () {
						//show loading..
					}).on('typeahead:asynccancel typeahead:asyncreceive', function () {
						//hide spinner
					}).bind('typeahead:render', function (e) {
						self.ui.searchDoofBox.parent().find('.tt-selectable:first').addClass('tt-cursor');
					}).bind("typeahead:select", function (ev, suggestion) {
						var str = suggestion.replace(/\s+/g, '');
						var $suggestionEl = $('.typeahead-suggestion-' + str);
						var $headerEl = $suggestionEl.closest('.tt-dataset').find('.suggestion-header');
						if ($headerEl.hasClass('food-suggestions')) {
							self.foodSelect(suggestion);
						} else if ($headerEl.hasClass('cuisine-suggestions')) {
							self.cuisineSelect(suggestion);
						} else {
							self.restaurantSelect(suggestion);
						}
					});
			});
		},
		makeGeolocationBox: function() {
			var self= this;
			this.googleService.makeGeolocatorBox('search__location').then(function(autoCompleteBox) {
				autoCompleteBox.addListener('place_changed', function() {
					var place= autoCompleteBox.getPlace();
					if(!place.geometry) {return ;}
					if(place.geometry.location) {
						self.latLng.lat= place.geometry.location.lat();
						self.latLng.lng= place.geometry.location.lng();
						self.place= place.formatted_address;
						self.search();
					}
				});
			});
		},
		onShow: function () {
			this.loadTypeahead();
			this.makeGeolocationBox();
		},
	});
	return SearchBoxView;
});