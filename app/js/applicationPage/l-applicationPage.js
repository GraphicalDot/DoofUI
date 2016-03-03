/* global Materialize */
define(function (require) {
	"use strict";

	var $ = require('jquery');
	var Handlebars = require('handlebars');
	var Marionette = require('marionette');
	var Template = require('text!./applicationPage.html');

	var SearchView = require('./search/i-search');
	var UserView = require('./userMenuView/i-userMenu');
	var ListView = require('./listView/c-list');
	var MapView = require('./mapView/i-map');
	var RestaurantDetailView = require('./detailView/i-detailView');
	// var RestaurantDetailView = require('./detailView2/i-detailView');
	var ProfileView = require('./userProfileView/i-userProfile');

	var TrendingItems = require('./../models/get_trending');
	var NearbyRestaurants = require('./../models/nearest_eateries');
	var Restaurant = require('./../models/geteatery');
	var UserFeedback = require('./../models/user_feedback');

	var Promise = require('es6promise').Promise;

	var ApplicationPage = Marionette.LayoutView.extend({
		id: 'applicationPage',
		template: Handlebars.compile(Template),
		regions: {
			search: '.masthead__search-container',
			userMenu: '.nav-menu-item__user',
			list: '.body__list',
			map: '.map',
			detail: '.detail',
			'profile-box': '.profile-box',
		},
		initialize: function (opts) {
			this.user = opts.user;
			if (opts.position) {
				this.latLng = opts.position.latLng ? opts.position.latLng : { lat: 28, lng: 77 };
				this.address = opts.position.place ? opts.position.place : 'Delhi';
			}

			this.searchView = new SearchView({ address: this.address, latLng: this.latLng });
			this.userView = new UserView({ model: this.user });
			this.listView = new ListView({ collection: this.collection, user: this.user });
			this.mapView = new MapView({ collection: this.collection, lat: this.latLng.lat, lng: this.latLng.lng, user: this.user });

			this.trendingItems = new TrendingItems();
			this.nearbyRestaurants = new NearbyRestaurants();
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
		ui: {
			'feedbackLink': '#nav-menu__feedback-link',
			'mainMenuTabs': 'ul.body__main-menu',
			'subMenuTabs': 'ul.body__sub-menu',
			'getTrendingItem': '#sub-menu__trending-link',
			'getNearbyItem': '#sub-menu__nearme-link'
		},
		events: {
			'submit form#feedback-form': 'submitFeedback', //comes after submitting Feedback
			'click @ui.getTrendingItem': 'showTrendingItems',
			'click @ui.getNearbyItem': 'showNearbyItems',
			'click #see-more-results-button': 'showMoreResults'
		},
		childEvents: {
			'show:profile': 'showProfile',	//comes from userMenuView upon clicking My Profile.
			'show:restaurants': 'showRestaurants',
			'open:restaurant': 'openRestaurant',
			'highlight:restaurant': 'highlight',
			'unhighlight:restaurant': 'unhighlight',
			'highlight:marker': 'highlightMarker',
			'unhighlight:marker': 'unhighlightMarker',
			'update:location': 'updateLocation',

			'place:changed': 'onPlaceChanged'
		},
		getTrendingItems: function () {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.trendingItems.fetch({ method: 'POST', data: { latitude: self.latLng.lat, longitude: self.latLng.lng } }).done(function () {
					resolve(self.trendingItems);
				}).fail(function () { console.log('trending items fetching failed probably'); reject(); });
			});
			return promise;
		},
		getNearbyItems: function () {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.nearbyRestaurants.fetch({ method: 'POST', data: { latitude: self.latLng.lat, longitude: self.latLng.lng } }).done(function () {
					resolve(self.nearbyRestaurants);
				}).fail(function () { console.log('trending items fetching failed probably'); reject(); });
			});
			return promise;
		},
		showNewData: function (data) {
			this.listView.updateData(data);
			this.mapView.updateData(data);
		},
		onPlaceChanged: function (childView) {
			var self = this;
			self.latLng = childView.position;
			if (childView.isDoofSearchActive()) {
				// show result on search View here.
			} else {
				// update my location marker in google map.
				self.mapView.updateMyPosition(self.latLng);

				// get If trending or nearBy results are selected.
				if ($("#sub-menu-nearme-item").hasClass('active')) {
					self.getNearbyItems().then(function (results) { self.showNewData(results); }, function (err) { });
				} else {
					self.getTrendingItems().then(function (results) { self.showNewData(results); }, function (err) { });
				}
			}
		},
		submitFeedback: function (e) {
			e.preventDefault();
			var userFeedback = new UserFeedback();
			if ($("#feedback-name").val() && $("#feedback-email").val() && $("#feedback-body").val()) {
				userFeedback.fetch({ method: 'POST', data: { fb_id: this.user.get('id'), "feedback": $("#feedback-body").val(), "name": $("#feedback-name").val(), "email": $("#feedback-email").val() } }).then(function (response) {
					if (response.success) {
						$('#feedback__modal').closeModal();
						$("#feedback-body").val('');
						Materialize.toast(response.message, 3000);
					} else {
						Materialize.toast("Sorry, some error.. Try again later..", 3000);
					}
				});
			}
		},
		showProfile: function () {
			var profileView = new ProfileView({ model: this.user });
			this.showChildView('profile-box', profileView);
		},
		updateDataInApplication: function (newCollection) {
			this.listView.updateCollection(newCollection);
			this.mapView.updateMarkers(newCollection);
		},
		showMoreResults: function (e) {
			// e.preventDefault();
			this.currentPage = this.currentPage + 1;
			if (this.currentShowing === 'trendingItems') {
				this.showTrendingItems(e);
			} else {
				this.showNearbyItems(e);
			}
		},
		showTrendingItems: function (e) {
			if (e) { e.preventDefault(); }

			var self = this;

			this.currentPage = this.currentPage ? this.currentPage : 0;
			console.log(this.currentPage);
			trendingItems.fetch({ method: 'POST', data: { latitude: this.latLng.lat, longitude: this.latLng.lng, skip: this.currentPage, limit: 20 } }).done(function () {
				self.collection = trendingItems;
				self.updateDataInApplication(self.collection);
			});
			this.currentShowing = 'trendingItems';
		},
		showNearbyItems: function (e) {
			if (e) { e.preventDefault(); }
			var self = this;
			var nearbyRestaurants = new NearbyRestaurants();
			this.currentPage = this.currentPage ? this.currentPage : 0;
			nearbyRestaurants.fetch({ method: 'POST', data: { latitude: this.latLng.lat, longitude: this.latLng.lng, skip: this.currentPage, limit: 20 } }).done(function () {
				self.collection = nearbyRestaurants;
				self.updateDataInApplication(self.collection);
			});
			this.currentShowing = 'nearmeItems';
		},

		showRestaurants: function (childView, restaurant_data) {
			this.updateDataInApplication(restaurant_data);
		},
		openRestaurant: function (childView, restaurant_id, restaurant_details) {
			var self = this;
			var restaurant = new Restaurant();
			var detailView = new RestaurantDetailView({
				model: restaurant, user: self.user, restaurant_detail: restaurant_details
			});

			restaurant.fetch({ method: "POST", data: { "__eatery_id": restaurant_id } }).then(function () {
				self.showChildView('detail', detailView);
			});
		},
		highlight: function (childView, eatery_id) {
			var $targets = $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]');
			var $target = $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]').filter(":first");
			$targets.addClass('active');
			$target.velocity("scroll", {
				container: $('.list'),
				duration: 500,
				offset: -180,
				easing: "ease-in-out"
			});
		},
		unhighlight: function (childView, eatery_id) {
			var $target = $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]');
			$target.removeClass('active');
		},
		highlightMarker: function (childView, eatery_id) {
			this.mapView.highlightMarker(eatery_id);
		},
		unhighlightMarker: function (childView, eatery_id) {
			this.mapView.unhighlightMarker(eatery_id);
		},
		onShow: function () {
			this.ui.feedbackLink.leanModal();
			this.showChildView('search', this.searchView);
			this.showChildView('userMenu', this.userView);
			this.showChildView('list', this.listView);
			this.showChildView('map', this.mapView);
			this.ui.mainMenuTabs.tabs();
			this.ui.subMenuTabs.tabs();
		}
	});
	return ApplicationPage;
});