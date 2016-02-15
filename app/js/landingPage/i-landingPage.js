/* global Materialize */
define(function (require) {
	"use strict";

	var $ = require('jquery');
	var Promise = require('es6promise').Promise;
	var Handlebars = require('handlebars');
	var Marionette = require('marionette');
	var Template = require('text!./landingPage.html');

	var LandingPage = Marionette.ItemView.extend({
		id: 'landingPage',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.location = {
				latLng: {lat: 28.613939, lng: 77.209021},
				place: 'Delhi'
			};
			this.user = opts.user;
		},
		templateHelpers: function () {
			return {
				'isUserAuthorized': function () {
					return this.user.isAuthorized();
				},
				'getUsername': function () {
					return this.user.get('name');
				},
				'startingAddress': function() {
					return this.location.place;
				},
			}
		},
		ui: {
			'enterButton': '#landingPage-enter-btn',
			'enter_as_options': 'input[type="radio"][name="enter_as"]'
		},
		events: {
			"click @ui.enterButton": "enterInsideDoof",
			"change @ui.enter_as_options": "changedUserMode"
		},
		changedUserMode: function (e) {
			var target = $(e.currentTarget);
			var self = this;
			if (target.hasClass('is_not_logged')) {
				this.user.login().then(function (success) {
					self.render();
				}, function (err) {

				});
			}
		},
		enterInsideDoof: function (e) {
			e.preventDefault();
			var self = this;
			this.isDataPresent().then(function (nearestEateries) {
				if (self.ui.enter_as_options.is(':checked')) {
					self.trigger("goToApplication", self.location, nearestEateries);
				} else {
					Materialize.toast("Select a user.", 2000);
				}
			}, function (err) {
				Materialize.toast("No data present for the given location. Please change.", 2000);
			});
		},
		isDataPresent: function (e) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				var NearestEateriesModel = require('../models/nearest_eateries');
				var nearestEateries = new NearestEateriesModel();
				nearestEateries.fetch({ method: 'POST', data: { latitude: self.location.latLng.lat, longitude: self.location.latLng.lng } }).then(function () {
					if (nearestEateries.length) {
						resolve(nearestEateries);
					} else {
						reject();
					}
				});
			});
			return promise;
		},
		geoCodeLatLng: function (lat, lng) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				require(['google-map-loader'], function (GoogleMapLoader) {
					GoogleMapLoader.done(function (GoogleMaps) {
						var geoCoder = new GoogleMaps.Geocoder;
						geoCoder.geocode({ 'location': { lat: lat, lng: lng } }, function (results, status) {
							if (status === GoogleMaps.GeocoderStatus.OK) {
								var result_address = results[1] ? results[1] : results[0];
								self.location.place = result_address.formatted_address;
								resolve();
							} else {
								reject();
							}
						});
					});
				});
			});
			return promise;
		},
		createGoogleAutocomplete: function (input) {
			var self = this;
			require(['google-map-loader'], function (GoogleMapLoader) {
				GoogleMapLoader.done(function (GoogleMaps) {
					var autoComplete = new GoogleMaps.places.Autocomplete(input);
					autoComplete.addListener('place_changed', function () {
						var place = autoComplete.getPlace();
						if (!place.geometry) { return; }
						if (place.geometry.location) {
							self.location.latLng.lat = place.geometry.location.lat();
							self.location.latLng.lng = place.geometry.location.lng();
						}
					});
				});
			});
		},
		onShow: function () {
			var self = this;
			var input = document.getElementById("landingPage-locationBox");
			self.createGoogleAutocomplete(input);
			function geoSuccess(position) {
				self.location.latLng.lat = position.coords.latitude;
				self.location.latLng.lng = position.coords.longitude;
				self.location.accuracy = position.coords.accuracy;
				self.geoCodeLatLng(self.location.latLng.lat, self.location.latLng.lng).then(function () {
					input.value = self.location.place;
				}, function (err) {
					input.value = "Sorry, couldnt get your address. Please find one here."
				});
			}
			function geoFail() {
				input.value = "Sorry, couldnt get your address. Please find one here."
			}
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(geoSuccess, geoFail, {});
			} else {
				geoFail();
			}
		},
	});

	return LandingPage;
});