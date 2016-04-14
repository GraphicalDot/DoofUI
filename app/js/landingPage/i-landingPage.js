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
			this.googleService= opts.googleService;
			this.dataService= opts.dataService;
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
				self.dataService.getTrending(self.location.latLng).then(function (trendingRestaurants) {
					if (trendingRestaurants.length) {
						resolve(trendingRestaurants);
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
				console.log("No data present for the given location. Please change.");
			});
		},
		createGoogleAutocomplete: function () {
			var self = this;
			this.googleService.makeGeolocatorBox('landingPage__location-input-box').then(function(autoComplete) {
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
		getUserLocation: function () {
			var self = this;
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					self.location.latLng.lat = position.coords.latitude;
					self.location.latLng.lng = position.coords.longitude;
					self.googleService.geoCodeService(self.location.latLng.lat, self.location.latLng.lng).then(function (geoCodeResult) {
						self.location.place = geoCodeResult.formatted_address;
						self.ui['location-input'].val(self.location.place);
					}, function(error) {});
				}, function (fail) { }, {});
			} else { }
		},
		onShow: function () {
			this.createGoogleAutocomplete();
			this.getUserLocation();
		},
	});
	return LandingPage;
});