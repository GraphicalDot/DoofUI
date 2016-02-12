define(function (require) {

	"use strict";

	var Backbone= require('backbone');
	var Handlebars = require('handlebars');
	var Marionette = require('marionette');
	var Template = require('text!./landingPage.html');

	var LandingPage = Marionette.ItemView.extend({
		id: 'landingPage',
		className: 'white-text center',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.position = { lat: 28.5192, lng: 77.2130 };
			this.address= "Delhi";
			// this.user.on('change', this.render, this);
		},
		events: {
			"click #landingPage-enter-btn": "checkIfData"
		},
		checkIfData: function (e) {
			var self= this;
			e.preventDefault();

			var NearbyRestaurants = Backbone.Collection.extend({ url: window.nearest_eateries, parse: function (res) { return res.result; } });
			this.nearbyRestaurants = new NearbyRestaurants();
			this.nearbyRestaurants.fetch({ method: 'POST', data: { latitude: this.position.lat, longitude: this.position.lng } }).then(function () {
				if(self.nearbyRestaurants && self.nearbyRestaurants.length) {
					self.trigger("goToApplication", self.position, self.address);
				} else {
					Materialize.toast("No data present for the given location. Please change.",2000);
				}
			});
		},
		onShow: function () {
			var self = this;
			require(['../../libraries/google-map-loader'], function (GoogleMapLoader) {
				GoogleMapLoader.done(function (GoogleMaps) {
					var input = document.getElementById("landingPage-locationBox");
					var autoComplete = new GoogleMaps.places.Autocomplete(input);
					var geoCoder = new GoogleMaps.Geocoder;

					function geoCodeLatLng() {
						geoCoder.geocode({ 'location': self.position }, function (results, status) {
							if (status === GoogleMaps.GeocoderStatus.OK) {
								if (results[1]) {
									input.value = results[1].formatted_address;
									self.address= results[1].formatted_address;
								}
							} else {
								input.value = "Sorry, couldnt get your address. Please find one here."
							}
						});
					}

					autoComplete.addListener('place_changed', function () {
						var place = autoComplete.getPlace();
						if (!place.geometry) { return; }
						if (place.geometry.location) {
							self.position.lat = place.geometry.location.lat();
							self.position.lng = place.geometry.location.lng();
						}
					});

					function onGeoSuccess(position) {
						self.position.lat = position.coords.latitude;
						self.position.lng = position.coords.longitude;
						self.accuracy = position.coords.accuracy;

						geoCodeLatLng();
					};

					function onGeoFail() {
						// geoCodeLatLng();
						input.value = "Sorry, couldnt get your location. You can help us find here.."
					};

					var opts = {};

					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoFail, opts);
					} else {
						onGeoFail();
					}
				});
			});
		},
   });

	return LandingPage;
});