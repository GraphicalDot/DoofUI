define(function (require) {

    "use strict";

    var $ = require('jquery');
    var Backbone= require('backbone');
    var Handlebars = require('handlebars');
    var Marionette = require('marionette');
    var Template = require('text!./applicationPage.html');

    var Promise = require('es6promise').Promise;

    var SearchBox = require('./search/i-search');
    var ListView = require('./listView/c-list');
    var MapView = require('./mapView/i-map');
    var Restaurants = require('./../models/restaurants');

    var Restaurant = require('./../models/restaurant');
    var RestaurantDetailView = require('./detailView/i-detailView');

    var Radio = require('radio');

    function findLatLong() {
        var promise = new Promise(function (resolve) {
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
            search: '.search', list: '.list', map: '.map', detail: '.detail', feedback: '.feedback'
        },
        initialize: function (opts) {
            var self = this;
            var userChannel = Radio.channel('user');
            this.applicationChannel= Radio.channel('application');

            self.user = opts.user;

            // hack to work with geolocation async time problem. Only send one request.
            this.xhrRequest = '';
            //    find lat, long
            this.position = { lat: 28.5192, lng: 77.2130 };
            findLatLong().then(function (location) {
                self.position = { lat: location.lat, lng: location.lng };
                self.onShow();
            });

            this.collection = new Restaurants();

            this.listView = new ListView({ collection: this.collection, user: this.user });
            this.mapView = new MapView({ collection: this.collection, lat: this.position.lat, lng: this.position.lng, user: this.user });

            this.applicationChannel.on('show:restaurant', function(id, info) {
               self.openRestaurant(id, info);   
            });
            
            this.applicationChannel.on('show:restaurants', function(data) {
               self.showRestaurants(data);   
            });
            
            this.applicationChannel.on('highlight:restaurant', function(id, info) {
               self.highlight(id, info);   
            });
            
            this.applicationChannel.on('unhighlight:restaurant', function(id, info) {
               self.unhighlight(id, info);   
            });
            
            this.applicationChannel.on('highlightMarker:restaurant', function(id, info) {
               self.highlightMarker(id, info);   
            });
            
            this.applicationChannel.on('unhighlightMarker:restaurant', function(id, info) {
               self.unhighlightMarker(id, info);   
            });
            userChannel.on('logged_in', function () {
                self.render();
            });
        },
        templateHelpers: {
            isLoggedIn: function () {
                return this.user.isAuthorized();
            },
            username: function () {
                return this.user.get('name');
            },
            profile_picture: function () {
                return this.user.get('picture');
            }
        },
        events: {
            'submit form#feedback-form': 'submitFeedback',
            'click .logout-btn': 'doLogout',
            'click .login-btn': 'doLogin'
        },

        doLogout: function () {
            var self = this;
            this.user.logout().then(function (success) {

                self.render();
                Backbone.history.loadUrl(Backbone.history.fragment);
            });
        },
        doLogin: function () {
            var self = this;
            this.user.login().then(function (success) {
                self.render();
                Backbone.history.loadUrl(Backbone.history.fragment);
            });
        },
        submitFeedback: function (e) {
            e.preventDefault();
            var Feedback= Backbone.Model.extend({url: window.usersfeedback});
			var feedback= new Feedback();
            
            if($("#feedback-name").val() && $("#feedback-email").val() && $("#feedback-body").val()) {
                feedback.fetch({method: 'POST', data: {fb_id: this.user.get('id'), "feedback": $("#feedback-body").val(), "name": $("#feedback-name").val(), "email": $("#feedback-email").val()}}).then(function(response) {
                    if(response.success) {
                          $('#feedback').closeModal();

                        Materialize.toast(response.message, 3000);
                    }
                });
            }
            //submit form here.
        },
        // childEvents: {
        //     'show:restaurants': 'showRestaurants',
        //     'show:restaurant': 'showRestaurant',
        //     'open:restaurant': 'openRestaurant',
        //     "highlight:restaurant": "highlight",
        //     "unhighlight:restaurant": "unhighlight",
        //     "highlightMarker:restaurant": "highlightMarker",
        //     "unhighlightMarker:restaurant": "unhighlightMarker"
        // },

        showRestaurants: function (restaurant_data) {
            var self = this;
            if(!restaurant_data) {restaurant_data= this.collection;};
            self.mapView.updateMarkers(restaurant_data);
            self.listView.updateCollection(restaurant_data);
        },
        openRestaurant: function (restaurant_id, restaurant_detail) {
            var self= this;
            var restaurant = new Restaurant();
            var detailView = new RestaurantDetailView({ model: restaurant, restaurant_detail: restaurant_detail, user: self.user });
            restaurant.fetch({ method: "POST", data: { "__eatery_id": restaurant_id } }).then(function () {
                self.showChildView('detail', detailView);
            });
        },
        showRestaurant: function (childView, restaurant_id, restaurant_detail) {
            var self = this;
            var detailView;
            var id = $(childView.el).attr('id');
            if (id === 'doof-search-view') {
                detailView = new RestaurantDetailView({ model: restaurant_id, user: self.user });
                self.showChildView('detail', detailView);
            } else {
                var restaurant = new Restaurant();
                restaurant.fetch({ method: "POST", data: { "__eatery_id": restaurant_id } }).then(function () {
                    self.showChildView('detail', detailView);
                });
            }
        },
        highlight: function (eatery_id) {
            if (eatery_id) {
				var $targets= $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]');
                var $target = $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]').filter(":first");
                $targets.addClass('active');
                $target.velocity("scroll", {
                    container: $('.list'),
                    duration: 500,
                    
                    offset: -180,
                    easing: "ease-in-out"
                });
            }
        },
        unhighlight: function (eatery_id) {
            var $target = $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]');
            $target.removeClass('active');
        },
        highlightMarker: function (eatery_id) {
            this.mapView.highlightMarker(eatery_id);
        },
        unhighlightMarker: function (eatery_id) {
            this.mapView.unhighlightMarker(eatery_id);
        },
        onDomRefresh: function () {
            $('.feedback-link').leanModal();

            $('.dropdown-button').dropdown({
                belowOrigin: true
            });
            this.searchView = new SearchBox();
            this.showChildView('search', this.searchView);
            // this.showChildView('map', this.mapView);
            // this.showChildView('list', this.listView);
        },
        onShow: function () {
            var self = this;
            this.collection.fetch({ method: 'POST', data: { latitude: this.position.lat, longitude: this.position.lng } }).done(function () {
                self.geoTimer = setTimeout(function () {
                    self.showChildView('map', self.mapView);
                    self.showChildView('list', self.listView);
                }, 2000);
            });
        }

    });

    return ApplicationPage;
});