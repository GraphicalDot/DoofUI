define(function (require) {
	"use strict";

	var $ = require('jquery');
	var Handlebars = require('handlebars');
	var Marionette = require('marionette');
	var Template = require('text!./search.html');

	// var Radio = require('radio');

	// var SearchModel= require('./../../models/search');

	var SearchBox = Marionette.ItemView.extend({
		id: 'doof-search-view',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.position = { lat: opts.latLng.lat, lng: opts.latLng.lng };
			this.address = opts.address;
			// this.model= new SearchModel();
			// this.position= opts.position;
			// this.address= opts.address;
      //       this.applicationChannel= Radio.channel('application');
		},
		templateHelpers: {
			address: function () {
				return this.address;
			}
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
			// var self= this;
			// if(!cuisine_name) {
			// 	this.clearSearch();
			// 	return;
			// }
			// this.model.fetch({method: 'POST', data: {type: 'cuisine', text: cuisine_name}}).then(function() {
			// 	self.applicationChannel.trigger('show:restaurants', self.model);
			// });
		},
		onFoodSelect: function (food_name) {
			// var self = this;
			// if (!food_name) {
			// 	this.clearSearch();
			// 	return;
			// }
			// this.model.fetch({method: 'POST', data: {type: 'dish', text: food_name}}).then(function() {
			// 	self.applicationChannel.trigger('show:restaurants', self.model);
			// });
		},
		onRestaurantSelect: function (restaurant_name) {
			// var self = this;
			// if (!restaurant_name) {
			// 	this.clearSearch();
			// 	return;
			// }
			// this.model.fetch({method: 'POST', data: {type: 'eatery', text: restaurant_name}}).then(function() {
      //           self.applicationChannel.trigger('show:restaurant', self.model.toJSON()[0].__eatery_id, self.model.toJSON()[0]);
			// });
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
		onDomRefresh: function () {
			// $('#search_location_select_box').material_select({
			// 	belowOrigin: true
			// });
		},
		makeGeoLocatorBox: function () {
			require(['google-map-loader'], function (GoogleMapLoader) {
				GoogleMapLoader.done(function (GoogleMaps) {
					var input = document.getElementById("doof_location_box");
					var autoComplete = new GoogleMaps.places.Autocomplete(input);
					autoComplete.addListener('place_changed', function () {
						var place = autoComplete.getPlace();
						if (!place.geometry) { return; }
						if (place.geometry.location) {
							this.position.lat = place.geometry.location.lat();
							this.position.lng = place.geometry.location.lng();
						}
					});
				});
			});
		},
		makeSuggestionBox: function () {
			require(["typeahead"], function() {
				$("#doof_search_box").typeahead(
					{ hint: true, highlight: true, minLength: 4 },
					{
						limit: 12,
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
							pending: '<div></div>',
							notFound: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No dish found', '</div>'].join('\n'),
							empty: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No dish found', '</div>'].join('\n'),
							suggestion: function (data) {
								var str = data.replace(/\s+/g, '');
								return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
							},
							header: '<i class="material-icons suggestion-type typeahead-header food">kitchen</i><span>Dishes</span>'
						}
					}, {
						limit: 12,
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
							empty: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No Restaurant found', '</div>'].join('\n'),
							suggestion: function (data) {
								var str = data.replace(/\s+/g, '');
								return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
							},
							header: '<i class="material-icons suggestion-type typeahead-header restaurant">store_mall_directory</i><span>Restaurant</span>'
						}
					}, {
						limit: 12,
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
							empty: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No Cuisines found', '</div>'].join('\n'),
							suggestion: function (data) {
								var str = data.replace(/\s+/g, '');
								return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
							},
							header: '<i class="material-icons suggestion-type typeahead-header cuisine">local_dining</i><span>Cuisines</span>'
						}
					}
				).on('typeahead:asyncrequest', function () {
					// $('.Typeahead-spinner').show();
				}).on('typeahead:asynccancel typeahead:asyncreceive', function () {
					// $('.Typeahead-spinner').hide();
				});

				$("#doof_search_box").bind("typeahead:select", function (ev, suggestion) {
					var str = suggestion.replace(/\s+/g, '');
					var $suggestionEl = $('.typeahead-suggestion-' + str);
					var $headerEl = $suggestionEl.closest('.tt-dataset').find('.typeahead-header');

					if ($headerEl.hasClass('food')) {
						// self.onFoodSelect(suggestion);
					} else if($headerEl.hasClass('cuisine')) {
						// self.onCuisineSelect(suggestion);
					} else {
						// self.onRestaurantSelect(suggestion);
					}
				});

				$("#doof_search_box").enterKey(function (e) {
					if ($(this).val()) {
						// self.onNullSelect($(this).val());
					} else {
						// self.clearSearch();
					}
				});
			});
		},
		onShow: function () {
			this.makeGeoLocatorBox();
			this.makeSuggestionBox();
			// var self= this;
      //       // require(['typeahead'], function () {
			// 	var input = document.getElementById("doof_location_box");
			// 	var autoComplete = new google.maps.places.Autocomplete(input);
			// 	console.log(input);
			// 	autoComplete.addListener('place_changed', function () {
			// 		var place = autoComplete.getPlace();
			// 		if (!place.geometry) { return; }
			// 		if (place.geometry.location) {
			// 			// self.position.lat = place.geometry.location.lat();
			// 			// self.position.lng = place.geometry.location.lng();
			// 		}
			// 	});



		}
	});

	return SearchBox;
});