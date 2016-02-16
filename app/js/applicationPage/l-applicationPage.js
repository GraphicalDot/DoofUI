define(function (require) {
	"use strict";

	// var Backbone = require('backbone');
	var $ = require('jquery');
	var Handlebars = require('handlebars');
	var Marionette = require('marionette');
	var Template = require('text!./applicationPage.html');

	// var Promise = require('es6promise').Promise;

	// var MapView = require('./mapView/i-map');
	// var Restaurants = require('./../models/restaurants');

	// var SearchBox = require('./search/i-search');

	// var Restaurant = require('./../models/restaurant');
	// var RestaurantDetailView = require('./detailView/i-detailView');

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

	var SearchView= require('./search/i-search');
	var ListView = require('./listView/c-list');

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
			this.user= opts.user;
			this.latLng= opts.position.latLng;
			this.address= opts.position.place;

			this.searchView= new SearchView({address: this.address, latLng: this.latLng});
			this.listView = new ListView({ collection: this.collection, user: this.user });
			// 			var self = this;
			// 			this.applicationChannel = Radio.channel('application');
			// 			self.user = opts.user;
			// 			this.position = opts.position.latLng;
			// 			this.address = opts.position.place;

			// 			this.collection = new Restaurants();

			// 			this.listView = new ListView({ collection: this.collection, user: this.user });
			// 			this.mapView = new MapView({ collection: this.collection, lat: this.position[0], lng: this.position[1], user: this.user });

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
			// console.log('si it?');
			// 			var UserProfileView = require('./_header/view');
			// 			this.headerView = new UserProfileView({ model: self.user });
		},
		templateHelpers: {
			// isLoggedIn: function () {
			// 	return this.user.isAuthorized();
			// },
			// username: function () {
			// 	return this.user.get('name');
			// },
			// profile_picture: function () {
			// 	return this.user.get('picture');
			// },
			// useremail: function () {
			// 	return this.user.get('email');
			// }
		},
		events: {
			'click  #sub-menu-food-item': 'subMenuFoodClicked',
			'click #sub-menu-restaurant-item': 'subMenuRestaurantClicked'
			// 'submit form#feedback-form': 'submitFeedback',
			// 'click .seeNearMe': 'showNearMe',
			// 'click .seeTrending': 'showTrending',
		},
		subMenuFoodClicked: function(e) {
			e.preventDefault();
			console.log('Food clciked');
		},
		subMenuRestaurantClicked: function(e) {
			e.preventDefault();
			console.log('Restaurant clciked');
		},
		submitFeedback: function (e) {
			// e.preventDefault();
			// var Feedback = Backbone.Model.extend({ url: window.usersfeedback });
			// var feedback = new Feedback();

			// if ($("#feedback-name").val() && $("#feedback-email").val() && $("#feedback-body").val()) {
			// 	feedback.fetch({ method: 'POST', data: { fb_id: this.user.get('id'), "feedback": $("#feedback-body").val(), "name": $("#feedback-name").val(), "email": $("#feedback-email").val() } }).then(function (response) {
			// 		if (response.success) {
			// 			$('#feedback').closeModal();
			// 			Materialize.toast(response.message, 3000);
			// 		} else {
			// 			Materialize.toast("Sorry, some error.. Try again laer..", 3000);
			// 		}
			// 	});
			// }
			//submit form here.
		},

		showNearMe: function (e) {
			// var self = this;
			// e.preventDefault();
			// var NearbyRestaurants = Backbone.Collection.extend({ url: window.nearest_eateries, parse: function (res) { return res.result; } });
			// this.nearbyRestaurants = new NearbyRestaurants();
			// this.nearbyRestaurants.fetch({ method: 'POST', data: { latitude: this.position[0], longitude: this.position[1] } }).then(function () {
			// 	$(".seeNearMe").addClass('active');
			// 	$(".seeTrending").removeClass('active');
			// 	var xPosition = $(".seeNearMe").parent().offset();
			// 	$(".sub-menu-indicator").css({ "left": xPosition.left - 1 });

			// 	self.showRestaurants(self.nearbyRestaurants, 'nearby');
			// });
		},
		showTrending: function (e) {
			// e.preventDefault();
			// $(".seeNearMe").removeClass('active');
			// $(".seeTrending").addClass('active');
			// var xPosition = $(".seeTrending").parent().offset();
			// $(".sub-menu-indicator").css({ "left": xPosition.left - 1 });
			// var trending_restaurant_data = this.collection;
			// this.mapView.updateMarkers(trending_restaurant_data);
			// this.listView.updateCollection(trending_restaurant_data);
		},
		showRestaurants: function (restaurant_data, isNearby) {
			// var self = this;
			// if (!restaurant_data) { restaurant_data = this.collection; };
			// self.mapView.updateMarkers(restaurant_data);
			// self.listView.updateCollection(restaurant_data, isNearby);
		},
		openRestaurant: function (restaurant_id, restaurant_detail) {
			// var self = this;
			// var restaurant = new Restaurant();
			// var detailView = new RestaurantDetailView({ model: restaurant, restaurant_detail: restaurant_detail, user: self.user });
			// restaurant.fetch({ method: "POST", data: { "__eatery_id": restaurant_id } }).then(function () {
			// 	self.showChildView('detail', detailView);
			// });
		},
		showRestaurant: function (childView, restaurant_id, restaurant_detail) {
			// var self = this;
			// var detailView;
			// var id = $(childView.el).attr('id');
			// if (id === 'doof-search-view') {
			// 	detailView = new RestaurantDetailView({ model: restaurant_id, user: self.user });
			// 	self.showChildView('detail', detailView);
			// } else {
			// 	var restaurant = new Restaurant();
			// 	restaurant.fetch({ method: "POST", data: { "__eatery_id": restaurant_id } }).then(function () {
			// 		self.showChildView('detail', detailView);
			// 	});
			// }
		},
		showUserProfile: function (profileView) {

		},
		highlight: function (eatery_id) {
			// if (eatery_id) {
			// 	var $targets = $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]');
			// 	var $target = $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]').filter(":first");
			// 	$targets.addClass('active');
			// 	$target.velocity("scroll", {
			// 		container: $('.list'),
			// 		duration: 500,

			// 		offset: -180,
			// 		easing: "ease-in-out"
			// 	});
			// }
		},
		unhighlight: function (eatery_id) {
			// var $target = $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]');
			// $target.removeClass('active');
		},
		highlightMarker: function (eatery_id) {
			// this.mapView.highlightMarker(eatery_id);
		},
		unhighlightMarker: function (eatery_id) {
			// this.mapView.unhighlightMarker(eatery_id);
		},
		onDomRefresh: function () {
			// $('.feedback-link').leanModal();
		},
		onShow: function () {
			this.showChildView('search', this.searchView);
			this.showChildView('list', this.listView);
			$('ul.sub-menu').tabs();
			// var self = this;
			// this.showChildView('header', this.headerView);
			// this.searchView = new SearchBox({ position: self.position, address: self.address });
			// this.showChildView('search', this.searchView);
			// this.fetchXhr = self.collection.fetch({ method: 'POST', data: { latitude: self.position.lat, longitude: self.position.lng } }).done(function () {
			// 	self.showChildView('map', self.mapView);
			// 	self.showChildView('list', self.listView);
			// });
		}
	});

	return ApplicationPage;
});