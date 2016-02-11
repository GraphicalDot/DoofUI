define(function (require) {
	'use strict';

	var Marionette = require('marionette');
	var Handlebars = require('handlebars');

	var Template = require('text!./landingPage.html');

	var LandingPage = Marionette.ItemView.extend({
		id: 'landingPage',
		classNmae: 'doof-lp',
		template: Handlebars.compile(Template),
		initialize: function (opts) {
			this.user = opts.user;

			this.defaultPlace = 'Delhi';
			this.position = { lat: 28.613939, long: 77.209021 };
		},
		onShow: function () {
			var self= this;
			require(['../helpers/google_map_loader'], function (GoogleMapLoader) {
				GoogleMapLoader.done(function (GoogleMaps) {
					var input = document.getElementById("lp-locationBox");
					var autoComplete = new GoogleMaps.places.Autocomplete(input);
					var geoCoder = new GoogleMaps.Geocoder;

					function geoCodeLatLng() {
						geoCoder.geocode({ 'location': self.position }, function (results, status) {
							if (status === GoogleMaps.GeocoderStatus.OK) {
								if (results[1]) {
									input.value = results[1].formatted_address;
									self.address = results[1].formatted_address;
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
		}
	});

	return LandingPage;
});