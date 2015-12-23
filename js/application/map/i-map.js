/* global google */
define(function (require) {

	"use strict";

	var Handlebars = require('handlebars');
	var Marionette = require('backbone.marionette');

	var MapView = Marionette.ItemView.extend({
		id: 'map',
		template: Handlebars.compile(""),
		onShow: function () {
			require(["require-async!http://maps.googleapis.com/maps/api/js"], function () {
				var mapCanvas = document.getElementById("map");
				var centerPoint = new google.maps.LatLng(26, 73);

				var mapOptions = {
					center: centerPoint,
					zoom: 16
				}

				var map = new google.maps.Map(mapCanvas, mapOptions);
			});
		}
	});

	return MapView;
})