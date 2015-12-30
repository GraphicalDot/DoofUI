define(function (require) {

    "use strict";

    var Handlebars = require('handlebars');
    var Marionette = require('marionette');
    var Template = require('text!./applicationPage.html');
    
    var Promise= require('es6promise').Promise;
    
    var SearchBox= require('./search/i-search');
    var ListView= require('./listView/c-list');
    var MapView= require('./mapView/i-map');
    var Restaurants= require('./../models/restaurants');

    function findLatLong() {
        var promise= new Promise(function(resolve) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
                });
            }    
        });
        return promise;
        
    }

    var ApplicationPage = Marionette.LayoutView.extend({
        id: 'applicationPage',
        template: Handlebars.compile(Template),
        regions: {
            search: '.search',
            list: '.list',
            map: '.map',
            detail: '.detail',
            feedback: '.feedback'
        },
        initialize: function () {
            var self= this;
            this.xhrRequest= '';
            //    find lat, long
            this.position =  { lat: 28.5192, lng: 77.2130 };
            findLatLong().then(function(location) {
                if(self.xhrRequest) {
                    self.xhrRequest.abort();
                    if(self.geoTimer) {
                        clearTimeout(self.geoTimer);
                        self.geoTimer= '';
                    }
                    self.position= {lat: location.lat, lng: location.lng};
                    self.onShow();
                }
            });
            this.collection= new Restaurants();
            
            this.searchView= new SearchBox();
            this.listView= new ListView({collection: this.collection});
            this.mapView= new MapView({collection: this.collection, lat: this.position.lat, lng: this.position.lng});
        },

        onShow: function() {
            var self= this;
            this.showChildView('search', this.searchView);
            this.collection.fetch({method: 'POST', data: {latitude: this.position.lat, longitude: this.position.lng}}).done(function() {
                self.geoTimer= setTimeout(function() {
                    self.showChildView('map', self.mapView);
                    self.showChildView('list', self.listView);
                }, 2000);
            });
        }

    });

    return ApplicationPage;
});