define(function(require) {
	'use strict';

	var Marionette= require('marionette');
	var Handlebars= require('handlebars');

	var MapView= Marionette.ItemView.extend({
		id: 'doofMap',
		template: Handlebars.compile(""),
		initialize: function(opts) {
			this.latLng= opts.latLng;
		},
		onShow: function() {
			this.loadGoogleMap();
		},
		loadGoogleMap: function() {
			var self= this;
			require(['google-map-loader'], function(GoogleMapsLoader) {
				GoogleMapsLoader.done(function(GoogleMaps) {
					var mapEl= document.getElementById('doofMap'),
						center= new GoogleMaps.LatLng(self.latLng.lat, self.latLng.lng);

					self.map= new GoogleMaps.Map(mapEl);
				});
			});
		}
	});

	return MapView;
});