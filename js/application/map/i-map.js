/* global google */
define(function (require) {

	"use strict";

	var _ = require('underscore');
	var Handlebars = require('handlebars');
	var Marionette = require('backbone.marionette');

	var MapView = Marionette.ItemView.extend({
		id: 'map',
		template: Handlebars.compile(""),
		initialize: function (opts) {
			this.lat = opts.lat;
			this.lng = opts.lng;
			this.markersArray = [];
		},
		showCustomControls: function () {

		},
		showMarkers: function (markers) {
			var self = this;
			var mapBounds = new google.maps.LatLngBounds();

			// clear old markers
			_.each(self.markersArray, function (marker) {
				marker.setMap(null);
			});

			self.markersArray = [];

			_.each(markers, function (marker, i) {
				window.setTimeout(function() {
					var markerObject = {};
					markerObject.lat = marker.eatery_coordinates ? marker.eatery_coordinates[0] : marker.location.lat;
					markerObject.lng = marker.eatery_coordinates ? marker.eatery_coordinates[1] : marker.location.lon;

					var mapMarker = new google.maps.Marker({
						map: self.map,
						position: new google.maps.LatLng(markerObject.lat, markerObject.lng),
						title: marker.eatery_name,
						eatery_id: marker.eatery_id,
						address: marker.eatery_address,
						html: "<div id='infobox'>" + marker.eatery_name + "<br />" + marker.eatery_address + "</div>"
					})

					google.maps.event.addListener(mapMarker, 'mouseover', function () { });
					google.maps.event.addListener(mapMarker, 'mouseout', function () { });
					google.maps.event.addListener(mapMarker, 'click', function () { });

					self.markersArray.push(mapMarker);

					mapBounds.extend(mapMarker.getPosition());
					if (i === markers.length - 1) {
						self.map.fitBounds(mapBounds);
					}
				}, i*200);
			});
		},
		onShow: function () {
			var self = this;
			require(["require-async!http://maps.googleapis.com/maps/api/js"], function () {
				var mapCanvas = document.getElementById("map");
				var centerPoint = new google.maps.LatLng(self.lat, self.lng);

				var mapOptions = {
					center: centerPoint,
					zoom: 16,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					mapTypeControl: true
				}

				var map = new google.maps.Map(mapCanvas, mapOptions);
				self.map = map;
				self.infoWindow = new google.maps.InfoWindow({ content: "" });
				self.showMarkers(self.collection.toJSON());

				self.myLocationMarker = new google.maps.Marker({
					map: self.map,
					position: centerPoint,
					draggable: true,
					title: "My Location"
				});

				google.maps.event.addListener(self.myLocationMarker, 'drag', function (event) {

				});

				google.maps.event.addListener(self.myLocationMarker, 'dragend', function (event) {
					var lat = event.latLng.lat(),
						lng = event.latLng.lng();
					self.triggerMethod('location:changed', lat, lng);
				});

				self.showCustomControls();
			});
		}
	});

	return MapView;
})