/* global Materialize */
define(function (require) {
	"use strict";

	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./applicationPage.html');
	// var $ = require('jquery');

	// var SearchView = require('./search/i-search');
	var ListView= require('./list/c-listView');
	var MapView= require('./map/i-mapView');
	// var UserView = require('./userMenuView/i-userMenu');
	// var ListView = require('./listView/c-list');
	// var MapView = require('./mapView/i-map');
	// var RestaurantDetailView = require('./detailView/i-detailView');
	// var RestaurantDetailView = require('./detailView/i-detailView');
	// var ProfileView = require('./userProfileView/i-userProfile');

	// var TrendingItems = require('./../models/get_trending');
	// var NearbyRestaurants = require('./../models/nearest_eateries');
	// var Restaurant = require('./../models/geteatery');
	// var UserFeedback = require('./../models/user_feedback');

	// It is for Getting Items for Searched Query..
	// var TextSearchCollection = require('./../models/text_search');

	// var Promise = require('es6promise').Promise;

	var ApplicationPage = Marionette.LayoutView.extend({
		id: 'applicationPage',
		template: Handlebars.compile(Template),

		initialize: function (opts) {
			this.user = opts.user;
			this.latLng = opts.position ? opts.position.latLng : { lat: 28, lng: 77 };
			this.address = opts.position ? opts.position.place : 'Delhi';

			// this.searchView = new SearchView({ address: this.address, latLng: this.latLng });
			// this.userView = new UserView({ model: this.user });
			this.listView = new ListView({ user: this.user });
			this.mapView = new MapView({ latLng: this.latLng });

			// this.trendingItems = new TrendingItems();
			// this.nearbyRestaurants = new NearbyRestaurants();

			// this.textSearchCollection = new TextSearchCollection();
		},
		regions: {
			search: '.masthead__search-container',
		// 	userMenu: '.nav-menu-item__user',
		// 	list: '.body__list',
		// 	map: '.body__map-container',
		// 	detail: '.body__detail-box',
		// 	'profile-box': '.body__profile-box',
		// 	'search-results': '.body__search-results-container'
		},
		templateHelpers: {
			// isLoggedIn: function () {
			// 	return this.user.isAuthorized();
			// },
			// username: function () {
			// 	return this.user.get('name');
			// },
			// useremail: function () {
			// 	return this.user.get('email');
			// }
		},
		ui: {
			// 'feedbackLink': '#nav-menu__feedback-link',
			// 'mainMenuTabs': 'ul.body__main-menu',
			// 'subMenuTabs': 'ul.body__sub-menu',
			// 'getTrendingItem': '#sub-menu__trending-link',
			// 'getNearbyItem': '#sub-menu__nearme-link',
			// 'nextPageBtn': '.pagination__next-btn',
			// 'prevPageBtn': '.pagination__prev-btn'
		},
		events: {
			// 'click #search-results__back-btn': 'removeSearch',
			// 'submit form#feedback-form': 'submitFeedback', //comes after submitting Feedback
			// 'click @ui.getTrendingItem': 'showTrendingItems',
			// 'click @ui.getNearbyItem': 'showNearbyItems',
			// 'click #see-more-results-button': 'showMoreResults',
			// 'click @ui.nextPageBtn': 'openNextPage',
			// 'click @ui.prevPageBtn': 'openPrevPage'
		},
		childEvents: {
			//comes from userMenuView upon clicking My Profile.
			// 'show:profile': 'showProfile',
			// 'open:restaurant': 'openRestaurant',
			// 'highlight:restaurant': 'highlight',
			// 'unhighlight:restaurant': 'unhighlight',
			// 'highlight:marker': 'highlightMarker',
			// 'unhighlight:marker': 'unhighlightMarker',

			// 'place:changed': 'triggerSearch',
			// 'search:clicked': 'triggerSearch',
			// 'food:searched': 'showFood',
			// 'restaurant:searched': 'showRestaurant',
			// 'cuisine:searched': 'showCuisine'
		},
		getTrendingItems: function () {
			// var self = this;
			// var promise = new Promise(function (resolve, reject) {
			// 	self.trendingItems.fetch({ method: 'POST', data: { latitude: self.latLng.lat, longitude: self.latLng.lng } }).done(function () {
			// 		resolve(self.trendingItems);
			// 	}).fail(function () { console.log('trending items fetching failed probably'); reject('trending items fetching failed probably'); });
			// });
			// return promise;
		},
		getNearbyItems: function () {
			// var self = this;
			// var promise = new Promise(function (resolve, reject) {
			// 	self.nearbyRestaurants.fetch({ method: 'POST', data: { latitude: self.latLng.lat, longitude: self.latLng.lng } }).done(function () {
			// 		resolve(self.nearbyRestaurants);
			// 	}).fail(function () { console.log('nearby items fetching failed probably'); reject('nearby items fetching failed probably'); });
			// });
			// return promise;
		},
		showNewData: function (data) {
			// this.listView.updateData(data);
			// this.mapView.updateData(data);
		},
		showError: function(errorMessage) {
			// this.listView.showErrorMessage(errorMessage);
		},
		removeSearch: function (e) {
			// e.preventDefault();
			// this.searchView.clearSearch();
			// this.searchView.clearDoofSearch();
			// this.triggerSearch(this.searchView);
		},
		triggerSearch: function (childView) {
			// var self = this;
			// self.latLng = childView.position;
			// update my location marker in google map.
			// self.mapView.updateMyPosition(self.latLng);
			// if (childView.isDoofSearchActive()) {
			// 	if (childView.isSearching === 'food') {
			// 		self.showFood(childView, $("#search_doof").val());
			// 	} else if (childView.isSearching === 'restaurant') {
			// 		self.showRestaurant(childView, $("#search_doof").val());
			// 	} else if (childView.isSearching === 'cuisine') {
			// 		self.showCuisine(childView, $("#search_doof").val());
			// 	}
			// } else {
			// 	// get If trending or nearBy results are selected.
			// 	if ($("#sub-menu__nearme-link").hasClass('active')) {
			// 		self.getNearbyItems().then(function (results) { self.showNewData(results); }, function (err) { self.showError(err) });
			// 	}
			// 	else {
			// 		self.getTrendingItems().then(function (results) { self.showNewData(results); }, function (err) { self.showError(err) });
			// 	}
			// 	$(".search-results__wrapper").css('display', 'none');
			// }
		},
		showCuisine: function (childView, cuisine_name) {
			// var self = this;
			// this.textSearchCollection.fetch({ method: 'POST', data: { type: 'cuisine', text: cuisine_name, lat: childView.position.lat, lng: childView.position.lng } }).then(function () {
			// 	var list = new ListView({ collection: self.textSearchCollection });
			// 	self.showChildView('search-results', list);
			// 	self.mapView.updateData(self.textSearchCollection);
			// 	$(".search-results__wrapper").css('display', 'block');
			// });
		},
		showRestaurant: function (childView, restaurant_name) {
			// var self = this;
			// this.textSearchCollection.fetch({ method: 'POST', data: { type: 'eatery', text: restaurant_name, lat: childView.position.lat, lng: childView.position.lng } }).then(function () {
				// FOR NOW SINCE DATA IS COMING THIS WAY.. SAHI KARNA H ISKO,
				// var list= new ListView({collection: self.textSearchCollection});
				// self.showChildView('search-results', list);
				// self.mapView.updateData(self.textSearchCollection);
				// $(".search-results__wrapper").css('display', 'block');

				// var eateryInformation = self.textSearchCollection.toJSON()[0];
				// self.openRestaurant(null, eateryInformation.__eatery_id, eateryInformation);
			// });
		},
		showFood: function (childView, food_name) {
			// var self = this;
			// this.textSearchCollection.fetch({ method: 'POST', data: { type: 'dish', text: food_name, lat: childView.position.lat, lng: childView.position.lng } }).then(function () {
			// 	var list = new ListView({ collection: self.textSearchCollection });
			// 	self.showChildView('search-results', list);
			// 	self.mapView.updateData(self.textSearchCollection);
			// 	$(".search-results__wrapper").css('display', 'block');
			// });
		},
		submitFeedback: function (e) {
			// e.preventDefault();
			// var userFeedback = new UserFeedback();
			// if ($("#feedback-name").val() && $("#feedback-email").val() && $("#feedback-body").val()) {
			// 	userFeedback.fetch({ method: 'POST', data: { fb_id: this.user.get('id'), "feedback": $("#feedback-body").val(), "name": $("#feedback-name").val(), "email": $("#feedback-email").val() } }).then(function (response) {
			// 		if (response.success) {
			// 			$('#feedback__modal').closeModal();
			// 			$("#feedback-body").val('');
			// 			Materialize.toast(response.message, 3000);
			// 		} else {
			// 			Materialize.toast("Sorry, some error.. Try again later..", 3000);
			// 		}
			// 	});
			// }
		},
		showProfile: function () {
			// var profileView = new ProfileView({ model: this.user });
			// this.showChildView('profile-box', profileView);
		},
		updateDataInApplication: function (newCollection) {
			// this.listView.updateCollection(newCollection);
			// this.mapView.updateMarkers(newCollection);
		},
		showTrendingItems: function (e) {
			// if (e) { e.preventDefault(); }
			// var self = this;
			// self.getTrendingItems().then(function (results) { self.showNewData(results); }, function (err) { self.showError(err) });
		},
		showNearbyItems: function (e) {
			// if (e) { e.preventDefault(); }
			// var self = this;
			// self.getNearbyItems().then(function (results) { self.showNewData(results); }, function (err) { self.showError(err) });
		},
		openNextPage: function(e) {
			// e.preventDefault();

		},
		openPrevPage: function(e) {
			// e.preventDefault();
		},
		openRestaurant: function (childView, restaurant_id, restaurant_details) {
			// var self = this;
			// var restaurant = new Restaurant();
			// var detailView = new RestaurantDetailView({
			// 	model: restaurant, user: self.user, restaurant_detail: restaurant_details
			// });

			// restaurant.fetch({ method: "POST", data: { "__eatery_id": restaurant_id } }).then(function () {
			// 	self.showChildView('detail', detailView);
			// });
		},
		highlight: function (childView, eatery_id) {
			// var $targets = $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]');
			// var $target = $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]').filter(":first");
			// $targets.addClass('active');
			// $target.velocity("scroll", {
			// 	container: $('.list'),
			// 	duration: 500,
			// 	offset: -180,
			// 	easing: "ease-in-out"
			// });
		},
		unhighlight: function (childView, eatery_id) {
			// var $target = $('.list .restaurant-list-item[eatery-id="' + eatery_id + '"]');
			// $target.removeClass('active');
		},
		highlightMarker: function (childView, eatery_id) {
			// this.mapView.highlightMarker(eatery_id);
		},
		unhighlightMarker: function (childView, eatery_id) {
			// this.mapView.unhighlightMarker(eatery_id);
		},
		onShow: function () {
			// this.ui.feedbackLink.leanModal();
			// this.showChildView('search', this.searchView);
			// this.showChildView('userMenu', this.userView);
			this.showChildView('list', this.listView);
			this.showChildView('map', this.mapView);
			// this.ui.mainMenuTabs.tabs();
			// this.ui.subMenuTabs.tabs();

			// this.showTrendingItems();
		}
	});
	return ApplicationPage;
});