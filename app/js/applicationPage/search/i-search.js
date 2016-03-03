// It contains 2 search box [Location and Doof Search] & a button.
// If only Location is changed, We update the Result in ListView.
// If Doof Search is used, then we open a Search View above ListView for searched result, [ On Closing Saerch View, doof search input value is also cleared]
define(function (require) {
	"use strict";

	var $ = require('jquery');
	var Handlebars = require('handlebars');
	var Marionette = require('marionette');
	var Template = require('text!./search.html');

	var TextSearchCollection = require('./../../models/text_search');

	var SearchBox = Marionette.ItemView.extend({
		id: 'doofSearch',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.position = opts.latLng;
			this.address = opts.address;
			this.doofSearchActive = false;
			this.previouslySearchedItems = [];
			this.textSearchCollection = new TextSearchCollection();
		},
		templateHelpers: { startingAddress: function () { return this.address; } },
		ui: {
			'geolocatorIcon': '.location-search__geolocate-me',
			'searchLocationBox': '#search__location',
			'searchDoofBox': '#search_doof',
			'clearSearchBtn': '.clear-search__icon'
		},
		events: {
			'click @ui.geolocatorIcon': 'getLocation'
			// 'click .clear_button': 'clearSearch',
			// 'click .search_button': 'instantSearch',
			// 'submit .search_box': 'instantSearch',
			// 'click @ui.clearSearchBtn': 'clearSearch'
		},
		isDoofSearchActive: function () {
			return this.doofSearchActive;
		},
		getLocation: function(e) {
			e.preventDefault();
			var self= this;
			function success(position) {
				self.position.lat= position.coords.latitude;
				self.position.lng = position.coords.longitude;
				require(['google-map-loader'], function (GoogleMapLoader) {
					GoogleMapLoader.done(function (GoogleMaps) {
						var geoCoder = new GoogleMaps.Geocoder;
						geoCoder.geocode({ 'location': self.position }, function (results, status) {
							if (status === GoogleMaps.GeocoderStatus.OK) {
								var result_address = results[1] ? results[1] : results[0];
								self.address = result_address.formatted_address;
								self.ui.searchLocationBox.val(self.address);
								self.triggerMethod('place:changed');
							} else {
								alert('cannot geocode you. some error');
							}
						});
					});
				});
			};
			function fail() {
				console.log("Sorry, couldnt get your location");
			};
			if(navigator.geolocation) {
				var options= {};
				navigator.geolocation.getCurrentPosition(success, fail, options);
			} else {
				fail();
			}
		},
		// clearSearch: function (e) {
		// 	e.preventDefault();
		// 	this.ui.searchDoofBox.val('');
		// 	$("#doof_search_box").val('');
		//       this.applicationChannel.trigger("show:restaurants");
		// 	this.triggerMethod('show:restaurants');
		// },

		// instantSearch: function (e) {
		// e.preventDefault();
		// var searchValue= $("#doof_search_box").val();
		// this.onNullSelect(searchValue);
		// },
		// onCuisineSelect: function (cuisine_name) {
		// var self = this;
		// if(!cuisine_name) {
		// 	this.clearSearch();
		// 	return;
		// }
		// this.textSearchModel.fetch({ method: 'POST', data: { type: 'cuisine', text: cuisine_name } }).then(function () {
		// self.triggerMethod('show:restaurants', self.textSearchModel);
		// });
		// },
		// onFoodSelect: function (food_name) {
		// var self = this;
		// if (!food_name) {
		// 	this.clearSearch();
		// 	return;
		// }
		// this.textSearchModel.fetch({ method: 'POST', data: { type: 'dish', text: food_name } }).then(function () {
		// self.triggerMethod('show:restaurants', self.textSearchModel);
		// });
		// 	self.applicationChannel.trigger('show:restaurants', self.model);
		// });
		// },
		// onRestaurantSelect: function (restaurant_name) {
		// var self = this;
		// if (!restaurant_name) {
		// 	this.clearSearch();
		// 	return;
		// }
		// this.textSearchModel.fetch({ method: 'POST', data: { type: 'eatery', text: restaurant_name } }).then(function () {
		// self.triggerMethod('open:restaurant', self.textSearchModel.toJSON()[0].__eatery_id, self.textSearchModel.toJSON()[0]);
		// });
		// },
		// onNullSelect: function (value) {
		// var self = this;
		// if (!value) {
		// 	this.clearSearch();
		// 	return;
		// }
		// this.model.fetch({method: 'POST', data: {type: null, text: value}}).then(function() {
		// 	self.applicationChannel.trigger('show:restaurants', self.model);
		// });
		// },
		foodSelect: function () { },
		restaurantSelect: function () { },
		cuisineSelect: function () { },
		/*  Geolocation Box :-
		1. On entering at free space, first option is select by default.
		2. On Selection of a place, we trigger an event for application to update Data.
		*/
		makeGeoLocatorBox: function () {
			var self = this;
			require(['google-map-loader'], function (GoogleMapLoader) {
				GoogleMapLoader.done(function (GoogleMaps) {
					var pac_input = document.getElementById('search__location'),
						options = { componentRestrictions: { country: 'in' } };

					(function pacSelectFirst(input) {
						// store the original event binding function
						var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;
						function addEventListenerWrapper(type, listener) {
							// Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
							// and then trigger the original listener.
							if (type == "keydown") {
								var orig_listener = listener;
								listener = function (event) {
									var suggestion_selected = $(".pac-item-selected").length > 0;
									if (event.which == 13 && !suggestion_selected) {
										var simulated_downarrow = $.Event("keydown", {
											keyCode: 40,
											which: 40
										});
										orig_listener.apply(input, [simulated_downarrow]);
									}
									orig_listener.apply(input, [event]);
								};
							}
							_addEventListener.apply(input, [type, listener]);
						}
						input.addEventListener = addEventListenerWrapper;
						input.attachEvent = addEventListenerWrapper;

						var autoComplete = new GoogleMaps.places.Autocomplete(input, options);
						autoComplete.addListener('place_changed', function () {
							var place = autoComplete.getPlace();
							if (!place.geometry) { return; }
							if (place.geometry.location) {
								self.position.lat = place.geometry.location.lat();
								self.position.lng = place.geometry.location.lng();
								self.address = place.formatted_address;
								self.triggerMethod('place:changed');
							}
						});
					})(pac_input);
				});
			});
		},
		makeSuggestionBox: function () {
			// var self = this;
			// require(["typeahead"], function () {
			// 	self.ui.searchDoofBox.typeahead(
			// 		{ hint: true, highlight: true, minLength: 4 },
			// 		{
			// 			limit: 12,
			// 			name: 'food',
			// 			async: true,
			// 			source: function (query, processSync, processAsync) {
			// 				return $.ajax({
			// 					url: "http://52.76.176.188:8000/suggestions",
			// 					type: 'POST',
			// 					data: { query: query },
			// 					dataType: 'json',
			// 					success: function (json) {
			// 						return processAsync(json.result[0].suggestions);
			// 					}
			// 				});
			// 			},
			// 			templates: {
			// 				notFound: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No dish found', '</div>'].join('\n'),
			// 				suggestion: function (data) {
			// 					var str = data.replace(/\s+/g, '');
			// 					return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
			// 				},
			// 				header: '<div class="search-header search-header__food"><i class="material-icons suggestion-type typeahead-header food">kitchen</i><span>Dishes</span></div>'
			// 			}
			// 		}, {
			// 			limit: 10,
			// 			name: 'restaurant',
			// 			async: true,
			// 			source: function (query, processSync, processAsync) {
			// 				return $.ajax({
			// 					url: "http://52.76.176.188:8000/suggestions",
			// 					type: 'POST',
			// 					data: { query: query },
			// 					dataType: 'json',
			// 					success: function (json) {
			// 						return processAsync(json.result[1].suggestions)
			// 					}
			// 				});
			// 			},
			// 			templates: {
			// 				notFound: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No Restaurant found', '</div>'].join('\n'),
			// 				suggestion: function (data) {
			// 					var str = data.replace(/\s+/g, '');
			// 					return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
			// 				},
			// 				header: '<div class="search-header search-header__restaurant"><i class="material-icons suggestion-type typeahead-header restaurant">store_mall_directory</i><span>Restaurant</span></div>'
			// 			}
			// 		}, {
			// 			limit: 10,
			// 			name: 'cuisine',
			// 			async: true,
			// 			source: function (query, processSync, processAsync) {
			// 				return $.ajax({
			// 					url: "http://52.76.176.188:8000/suggestions",
			// 					type: 'POST',
			// 					data: { query: query },
			// 					dataType: 'json',
			// 					success: function (json) {
			// 						return processAsync(json.result[2].suggestions)
			// 					}
			// 				});
			// 			},
			// 			templates: {
			// 				notFound: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No Cuisines found', '</div>'].join('\n'),
			// 				suggestion: function (data) {
			// 					var str = data.replace(/\s+/g, '');
			// 					return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
			// 				},
			// 				header: '<div class="search-header search-header__cuisine"><i class="material-icons suggestion-type typeahead-header cuisine">local_dining</i><span>Cuisines</span></div>'
			// 			}
			// 		}
			// 		).on('typeahead:asyncrequest', function () {
			// 			$('.Typeahead-spinner').show();
			// 		}).on('typeahead:asynccancel typeahead:asyncreceive', function () {
			// 			$('.Typeahead-spinner').hide();
			// 		});

			// 	self.ui.searchDoofBox.bind("typeahead:select", function (ev, suggestion) {
			// 		var str = suggestion.replace(/\s+/g, '');
			// 		var $suggestionEl = $('.typeahead-suggestion-' + str);
			// 		var $headerEl = $suggestionEl.closest('.tt-dataset').find('.typeahead-header');

			// 		if ($headerEl.hasClass('food')) {
			// 			self.onFoodSelect(suggestion);
			// 		} else if ($headerEl.hasClass('cuisine')) {
			// 			self.onCuisineSelect(suggestion);
			// 		} else {
			// 			self.onRestaurantSelect(suggestion);
			// 		}
			// 	});

			// 	self.ui.searchDoofBox.enterKey(function (e) {
			// 		if ($(this).val()) {
			// 			self.onNullSelect($(this).val());
			// 		} else {
			// 			self.clearSearch();
			// 		}
			// 	});
			// });
		},
		onShow: function () {
			this.makeGeoLocatorBox();
			// this.makeSuggestionBox();
		}
	});

	return SearchBox;
});