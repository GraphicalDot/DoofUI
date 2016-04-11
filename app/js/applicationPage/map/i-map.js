define(function (require) {
	'use strict';

	var _ = require('underscore');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');

	var MapView = Marionette.ItemView.extend({
		id: 'doof-map',
		template: Handlebars.compile(""),
		initialize: function (opts) {
			this.latLng = opts.latLng;
			this.markersArray = [];
		},
		//remove old markers from map and array
		removeOldMarkers: function () {
			_.each(this.markersArray, function (marker) {
				marker.setMap(null);
			});
			this.markersArray = [];
		},
		//check if a specfied marker already exist for the restaurant to prevent duplicacy.
		checkIfMarkerAlreayExist: function (marker_to_check) {
			var isExist = false;
			_.each(this.markersArray, function (marker) {
				if (marker.get('restaurant_id') === marker_to_check.eatery_details.__eatery_id) {
					isExist = true;
					return;
				}
			});
			return isExist;
		},
		//bound map to markers position
		setMarkersVisible: function () {
			var self = this;
			require(['google-map-loader'], function (GoogleMapLoader) {
				GoogleMapLoader.done(function (GoogleMaps) {
					var markersBound = new GoogleMaps.LatLngBounds();
					_.each(self.markersArray, function (marker) {
						markersBound.extend(marker.getPosition());
					});
					self.map.fitBounds(markersBound);
				});
			});
		},
		//show a list of markers on map
		showMarkers: function (markers) {
			var self = this;
			this.removeOldMarkers();
			_.each(markers, function (marker) {
				if (!self.checkIfMarkerAlreayExist(marker)) {
					require(['google-map-loader'], function (GoogleMapLoader) {
						GoogleMapLoader.done(function (GoogleMaps) {
							var googleMapMarker = new GoogleMaps.Marker({
								map: self.map,
								icon: './css/images/marker_non-selected.png',
								title: marker.eatery_details.eatery_name,
								position: new GoogleMaps.LatLng(marker.eatery_details.location[0], marker.eatery_details.location[1]),
								restaurant_name: marker.eatery_details.eatery_name,
								restaurant_id: marker.eatery_details.__eatery_id,
								address: marker.eatery_details.eatery_address,
								html: "<div id='infobox'>" + marker.eatery_details.eatery_name + "<br />" + marker.eatery_details.eatery_address + "</div>"
							});

							GoogleMaps.event.addListener(googleMapMarker, 'mouseover', function () { });
							GoogleMaps.event.addListener(googleMapMarker, 'mouseout', function () { });
							GoogleMaps.event.addListener(googleMapMarker, 'click', function () {
								self.infoWindow.setContent(this.get('html'));
								self.infoWindow.open(self.map, this);
							});

							self.markersArray.push(googleMapMarker);
						});
					});
				}
			});
			this.setMarkersVisible();
		},
		//load google maps
		loadGoogleMap: function () {
			var self = this;
			require(['google-map-loader'], function (GoogleMapLoader) {
				GoogleMapLoader.done(function (GoogleMaps) {
					var mapCanvas = document.getElementById("doof-map");
					var mapOptions = {
						center: new GoogleMaps.LatLng(self.latLng.lat, self.latLng.lng),
						zoom: 16,
					};
					self.map = new GoogleMaps.Map(mapCanvas, mapOptions);
					self.infoWindow = new GoogleMaps.InfoWindow({ content: "", });
				});
			});
		},
		onShow: function () {
			this.loadGoogleMap();
		}
	});
	return MapView;
});