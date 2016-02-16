/* global Materialize */
define(function (require) {
	"use strict";

	// var Backbone = require('backbone');
	var $ = require('jquery');
	var Handlebars = require('handlebars');
	var Marionette = require('marionette');
	var Template = require('text!./applicationPage.html');

	// var Promise = require('es6promise').Promise;

	// var Restaurants = require('./../models/restaurants');

	// var SearchBox = require('./search/i-search');


	// var Radio = require('radio');

	// function findLatLong() {
	// 	var promise = new Promise(function (resolve) {
	// 		if (navigator.geolocation) {
	// 			navigator.geolocation.getCurrentPosition(function (position) {
	// 				resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
	// 			});
	// 		}
	// 	});
	// 	return promise;

	// }

	var SearchView = require('./search/i-search');
	var UserProfileView = require('./_header/i-userProfile');
	var ListView = require('./listView/c-list');
	var MapView = require('./mapView/i-map');
	var RestaurantDetailView = require('./detailView/i-detailView');

	var TrendingItems = require('./../models/get_trending');
	var NearbyRestaurants = require('./../models/nearest_eateries');
	var Restaurant = require('./../models/geteatery');
	var UserFeedback = require('./../models/user_feedback');

	var ApplicationPage = Marionette.LayoutView.extend({
		id: 'applicationPage',
		template: Handlebars.compile(Template),
		regions: {
			search: '.search',
			list: '.list',
			map: '.map',
			detail: '.detail',
			feedback: '.feedback',
			'profile-box': '.profile-box',
			header: '.header__nav-menu-user-info'
		},
		initialize: function (opts) {
			this.user = opts.user;
			this.latLng = opts.position.latLng;
			this.address = opts.position.place;

			this.searchView = new SearchView({ address: this.address, latLng: this.latLng });
			this.headerView = new UserProfileView({ model: this.user });
			this.listView = new ListView({ collection: this.collection, user: this.user });
			this.mapView = new MapView({ collection: this.collection, lat: this.latLng.lat, lng: this.latLng.lng, user: this.user });
			// 			this.applicationChannel = Radio.channel('application');
			// 			this.applicationChannel.on("showProfile", function (profileView) {
			// 				self.showChildView('profile-box', profileView);
			// 			});

			// 			this.applicationChannel.on('show:restaurant', function (id, info) {
			// 				self.openRestaurant(id, info);
			// 			});

			// 			this.applicationChannel.on('show:restaurants', function (data) {
			// 				self.showRestaurants(data);
			// 			});

			// 			this.applicationChannel.on('highlight:restaurant', function (id, info) {
			// 				self.highlight(id, info);
			// 			});

			// 			this.applicationChannel.on('unhighlight:restaurant', function (id, info) {
			// 				self.unhighlight(id, info);
			// 			});

			// 			this.applicationChannel.on('highlightMarker:restaurant', function (id, info) {
			// 				self.highlightMarker(id, info);
			// 			});

			// 			this.applicationChannel.on('unhighlightMarker:restaurant', function (id, info) {
			// 				self.unhighlightMarker(id, info);
			// 			});
			
		},
		templateHelpers: {
			isLoggedIn: function () {
				return this.user.isAuthorized();
			},
			username: function () {
				return this.user.get('name');
			},
			useremail: function () {
				return this.user.get('email');
			}
		},
		events: {
			'click  #sub-menu-trending-item': 'subMenuTrendingClicked',
			'click #sub-menu-nearme-item': 'subMenuNearmeClicked',
			'submit form#feedback-form': 'submitFeedback',
		},
		childEvents: {
			'show:restaurants': 'showRestaurants',
			'open:restaurant': 'openRestaurant'
		},
		updateDataInApplication: function (newCollection) {
			this.listView.updateCollection(newCollection);
			this.mapView.updateMarkers(newCollection);
		},
		subMenuTrendingClicked: function (e) {
			e.preventDefault();
			var self = this;
			var trendingItems = new TrendingItems();
			trendingItems.fetch({ method: 'POST', data: { latitude: this.latLng.lat, longitude: this.latLng.lng } }).done(function () {
				self.collection = trendingItems;
				self.updateDataInApplication(self.collection);
			});
		},
		subMenuNearmeClicked: function (e) {
			e.preventDefault();
			var self = this;
			var nearbyRestaurants = new NearbyRestaurants();
			nearbyRestaurants.fetch({ method: 'POST', data: { latitude: this.latLng.lat, longitude: this.latLng.lng } }).done(function () {
				self.collection = nearbyRestaurants;
				self.updateDataInApplication(self.collection);
			});
		},
		submitFeedback: function (e) {
			e.preventDefault();
			var userFeedback = new UserFeedback();
			if ($("#feedback-name").val() && $("#feedback-email").val() && $("#feedback-body").val()) {
				userFeedback.fetch({ method: 'POST', data: { fb_id: this.user.get('id'), "feedback": $("#feedback-body").val(), "name": $("#feedback-name").val(), "email": $("#feedback-email").val() } }).then(function (response) {
					if (response.success) {
						$('#feedback').closeModal();
						Materialize.toast(response.message, 3000);
					} else {
						Materialize.toast("Sorry, some error.. Try again later..", 3000);
					}
				});
			}
		},
		showRestaurants: function (childView, restaurant_data) {
			this.updateDataInApplication(restaurant_data);
		},
		openRestaurant: function (childView, restaurant_id, restaurant_details) {
			var self = this;
			var restaurant = new Restaurant();
			var detailView = new RestaurantDetailView({ model: restaurant, user: self.user, restaurant_detail: restaurant_details });
			restaurant.fetch({ method: "POST", data: { "__eatery_id": restaurant_id } }).then(function () {
				self.showChildView('detail', detailView);
			});
		},
		// showRestaurant: function (childView, restaurant_id, restaurant_detail) {
		// 	// var self = this;
		// 	// var detailView;
		// 	// var id = $(childView.el).attr('id');
		// 	// if (id === 'doof-search-view') {
		// 	// 	detailView = new RestaurantDetailView({ model: restaurant_id, user: self.user });
		// 	// 	self.showChildView('detail', detailView);
		// 	// } else {
		// 	// 	var restaurant = new Restaurant();
		// 	// 	restaurant.fetch({ method: "POST", data: { "__eatery_id": restaurant_id } }).then(function () {
		// 	// 		self.showChildView('detail', detailView);
		// 	// 	});
		// 	// }
		// },
		// highlight: function (eatery_id) {
		// 	// if (eatery_id) {
		// 	// 	var $targets = $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]');
		// 	// 	var $target = $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]').filter(":first");
		// 	// 	$targets.addClass('active');
		// 	// 	$target.velocity("scroll", {
		// 	// 		container: $('.list'),
		// 	// 		duration: 500,

		// 	// 		offset: -180,
		// 	// 		easing: "ease-in-out"
		// 	// 	});
		// 	// }
		// },
		// unhighlight: function (eatery_id) {
		// 	// var $target = $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]');
		// 	// $target.removeClass('active');
		// },
		// highlightMarker: function (eatery_id) {
		// 	// this.mapView.highlightMarker(eatery_id);
		// },
		// unhighlightMarker: function (eatery_id) {
		// 	// this.mapView.unhighlightMarker(eatery_id);
		// },
		onShow: function () {
			$('.feedback-link').leanModal();
			this.showChildView('search', this.searchView);
			this.showChildView('header', this.headerView);
			this.showChildView('list', this.listView);
			this.showChildView('map', this.mapView);
			$('ul.sub-menu').tabs();
		}
	});

	return ApplicationPage;
});