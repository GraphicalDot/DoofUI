define(function (require) {
	'use strict';

	var Service = require('marionette-service');
	var Promise = require('es6promise').Promise;

	var GoogleServices = Service.extend({
		requests: {
			'makeGeolocatorBox': 'makeGeolocatorBox',
			'makeGoogleMap': 'makeGoogleMap',
			'geoCoderService': 'geoCodeService',
		},
		makeGeolocatorBox: function (input) {
			var promise = new Promise(function (resolve) {
				require(['jquery', 'google-map-loader'], function ($, GoogleMapLoader) {
					GoogleMapLoader.done(function (GoogleMaps) {
						var pac_input = document.getElementById(input),
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
										if ((event.which == 13 || event.which == 9) && !suggestion_selected) {
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
							resolve(autoComplete);
						})(pac_input);
					});
				});
			});
			return promise;
		},
		geoCodeService: function (lat, lng) {
			var promise = new Promise(function (resolve, reject) {
				require(['google-map-loader'], function (GoogleMapLoader) {
					GoogleMapLoader.done(function (GoogleMaps) {
						var geoCoder = new GoogleMaps.Geocoder;
						geoCoder.geocode({ 'location': { lat: lat, lng: lng } }, function (results, status) {
							if (status === GoogleMaps.GeocoderStatus.OK) {
								var result_address = results[1] ? results[1] : results[0];
								resolve(result_address);
							} else {
								reject('cannot geocode you. some error');
							}
						});
					});
				});
			});
			return promise;
		},
	});
	return GoogleServices;
});