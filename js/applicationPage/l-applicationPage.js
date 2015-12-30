define(function (require) {

    "use strict";

	var $= require('jquery');
    var Handlebars = require('handlebars');
    var Marionette = require('marionette');
    var Template = require('text!./applicationPage.html');

    var Promise= require('es6promise').Promise;

    var SearchBox= require('./search/i-search');
    var ListView= require('./listView/c-list');
    var MapView= require('./mapView/i-map');
    var Restaurants= require('./../models/restaurants');

	var Restaurant= require('./../models/restaurant');
	var RestaurantDetailView= require('./detailView/i-detailView');

	var Radio= require('radio');

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
        initialize: function (opts) {

            var self= this;
			self.user= opts.user;
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

			var userChannel = Radio.channel('user');

			userChannel.on('logged_in', function() {
				console.log(self.user);
				// self.render();
				// self.show();
			});

            this.searchView= new SearchBox();
            this.listView= new ListView({collection: this.collection});
            this.mapView= new MapView({collection: this.collection, lat: this.position.lat, lng: this.position.lng});
        },
		templateHelpers: {
			isLoggedIn: function () {
				return this.user.isAuthorized();
			},
			username: function() {
				return this.user.get('name');
			},
			profile_picture: function() {
				return this.user.get('picture');
			}
		},
		childEvents: {
			'show:restaurants': 'showRestaurants',
			'show:restaurant': 'showRestaurant',
			"highlight:restaurant": "highlight",
			"unhighlight:restaurant": "unhighlight",
			"highlightMarker:restaurant": "highlightMarker",
			"unhighlightMarker:restaurant": "unhighlightMarker"
		},
		showRestaurants: function(childView, restaurant_data) {
			var self= this;
			self.mapView.updateMarkers(restaurant_data);
			self.listView.updateCollection(restaurant_data);
		},
		showRestaurant: function(childView, restaurant_id, restaurant_detail) {
			var self= this;
			var detailView;
			var id= $(childView.el).attr('id');
			if(id=== 'doof-search-view') {
				console.log(restaurant_id);
				detailView= new RestaurantDetailView({model: restaurant_id});
				self.showChildView('detail', detailView);
			} else {
				var restaurant= new Restaurant();
				detailView= new RestaurantDetailView({model: restaurant, restaurant_detail: restaurant_detail});

				restaurant.fetch({ method: "POST", data: { "__eatery_id": restaurant_id } }).then(function () {
					self.showChildView('detail', detailView);
				});
			}
		},
		highlight: function(childView, eatery_id) {
			if(eatery_id) {
				var $target= $('.list .restaurant-list-item[eatery-id="'+eatery_id+'"]').filter(":first");
				$target.addClass('active');
				$target.velocity("scroll", {
					container: $('.list'),
					duration: 500,
					offset: -180,
					easing: "ease-in-out"
				});
			}
		},
		unhighlight: function(childView, eatery_id) {
			var $target= $('.list .restaurant-list-item[eatery-id="'+eatery_id+'"]');
			$target.removeClass('active');
		},
		highlightMarker: function(childView, eatery_id) {
			this.mapView.highlightMarker(eatery_id);
		},
		unhighlightMarker: function(childView, eatery_id) {
			this.mapView.unhighlightMarker(eatery_id);
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

			$('.feedback-link').leanModal();
        }

    });

    return ApplicationPage;
});