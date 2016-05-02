define(function (require) {
	"use strict";

	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./landingPage.html');

	var LandingPage = Marionette.ItemView.extend({
		id: 'landingPage',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.location = {
				latLng: {lat: 28.6139, lng: 77.2090}, place: 'New Delhi'
			};

			this.googleService = opts.googleService;
			this.restaurantService = opts.restaurantService;
		},
		ui: {
			'location-input': '#lp__location-input-box',
			'enterButton': '#lp__enter-app-btn',
		},
		events: {
			"click @ui.enterButton": "loadDoof"
		},
		onShow: function () {
			this.getUserLocation();
			this.createGoogleAutocomplete();
		},
		/**
		 * Use Navigator Geolocation to fetch User Position
		 */
		getUserLocation: function () {
			var self = this;
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					self.location.latLng.lat = position.coords.latitude;
					self.location.latLng.lng = position.coords.longitude;
					self.googleService.geoCodeService(position.coords.latitude, position.coords.longitude).then(function (geoCodeResult) {
						self.location.place = geoCodeResult.formatted_address;
						self.ui['location-input'].val(self.location.place);
					}, function (error) { });
				}, function (fail) { }, {});
			} else { }
		},
		createGoogleAutocomplete: function () {
			var self = this;
			this.googleService.makeGeolocatorBox('lp__location-input-box').then(function (autoComplete) {
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
		},
		// Loads Doof Application..
		loadDoof: function (e) {
			e.preventDefault();
			var self = this;
			this.restaurantService.checkIfDataAvailable(self.location.latLng).then(function (eateriesResponse) {
				//typeOfEateries can be 'trending' or 'nearby'
				var typeOfEateries = eateriesResponse.status;
				var eateriesList = eateriesResponse.restaurants;
				self.trigger("goToApplication", self.location, eateriesList, typeOfEateries);
			}, function (err) {
				console.log("No data present for the given location. Please change.");
			});
		},
	});
	return LandingPage;
});