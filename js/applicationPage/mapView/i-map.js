/* global google */
define(function(require) {
   
   "use strict";
   
    var _ = require('underscore');
    var Handlebars = require('handlebars');
	var Marionette = require('marionette');
    
    var MapView = Marionette.ItemView.extend({
        id: 'map-view',
        template: Handlebars.compile(""),
        initialize: function (opts) {
            this.lat= opts.lat;
            this.lng= opts.lng;
            this.markersArray = [];
        },
        onShow: function() {
            var self= this;
            require(["r-async!http://maps.googleapis.com/maps/api/js"], function () {
                var mapCanvas = document.getElementById("map-view");
                var centerPoint = new google.maps.LatLng(self.lat, self.lng);
                
                var mapOptions = {
					center: centerPoint,
					zoom: 16,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					mapTypeControl: true
				}
                
                var map = new google.maps.Map(mapCanvas, mapOptions);
                self.map = map;
                
                self.infoWindow = new google.maps.InfoWindow({ content: "",  });
            });
        }
    }); 
    
    return MapView;
});