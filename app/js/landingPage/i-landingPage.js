define(function (require) {
	"use strict";

	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./landingPage.html');

	var Promise = require('es6promise').Promise;

	var LandingPage = Marionette.ItemView.extend({
		id: 'landingPage',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.user = opts.user;
			this.location = {
				latLng: { lat: 0, lng: 0 },
				place: ''
			};
		},
		ui: {
			'location-input': '#landingPage__location-input-box',
			'enterButton': '#landingPage__enter-app-btn',
		},
		events: {
			"click @ui.enterButton": "loadDoof"
		},
		isDataPresentAtLngLng: function (e) {
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
		loadDoof: function (e) {
			e.preventDefault();
			var self = this;
			this.isDataPresentAtLngLng().then(function (nearestEateries) {
				self.trigger("goToApplication", self.location, nearestEateries);
			}, function (err) {
				console.log("No data present for the given location. Please change.", 2000);
			});
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
							self.location.place = place.formatted_address;
						}
					});
				});
			});
		},
		geoCodeLatLng: function (lat, lng) {
			var promise = new Promise(function (resolve, reject) {
				require(['google-map-loader'], function (GoogleMapLoader) {
					GoogleMapLoader.done(function (GoogleMaps) {
						var geoCoder = new GoogleMaps.Geocoder;
						geoCoder.geocode({ 'location': { lat: lat, lng: lng } }, function (results, status) {
							if (status === GoogleMaps.GeocoderStatus.OK) {
								var result_address = results[1] ? results[1] : results[0];
								resolve(result_address.formatted_address);
							} else {
								reject();
							}
						});
					});
				});
			});
			return promise;
		},
		getUserLocation: function (inputBox) {
			var self = this;
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					self.location.latLng.lat = position.coords.latitude;
					self.location.latLng.lng = position.coords.longitude;
					self.geoCodeLatLng(position.coords.latitude, position.coords.longitude).then(function (geoCoded_address) {
						self.location.place = geoCoded_address;
						inputBox.value = geoCoded_address;
					}, function (error) { });
				}, function (fail) { }, {});
			} else { }
		},
		onShow: function () {
			var input = document.getElementById("landingPage__location-input-box");
			this.createGoogleAutocomplete(input);
			this.getUserLocation(input);
		},
	});

	return LandingPage;
});