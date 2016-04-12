define(function (require) {
	'use strict';

	var Service = require('marionette-service');
	var Promise = require('es6promise').Promise;

	var TrendingRestaurants = require('./get_trending');
	var NearbyRestaurants = require('./nearest_eateries');
	var TextSearchRestaurants = require('./text_search');

	var SingleRestaurant= require('./geteatery');

	var DataService = Service.extend({
		initialize: function () {
			this.trendingRestaurants = new TrendingRestaurants();
			this.nearbyRestaurants = new NearbyRestaurants();
			this.textSearchRestaurants = new TextSearchRestaurants();

			this.singleRestaurant= new SingleRestaurant();
		},
		setup: function (latLng) {
			this.latLng = latLng;
		},
		requests: {
			'getTrending': 'getTrending',
			'getNearby': 'getNearby',
			'getTextSearch': 'getTextSearch',
			'getSingleRestaurant': 'getSingleRestaurant'
		},
		getTrending: function () {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.trendingRestaurants.fetch({ method: 'POST', data: { latitude: self.latLng.lat, longitude: self.latLng.lng } }).done(function () {
					resolve(self.trendingRestaurants.toJSON());
				}).fail(function () {
					reject('Failed Trending API');
				});
			});
			return promise;
		},
		getNearby: function () {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.nearbyRestaurants.fetch({ method: 'POST', data: { latitude: self.latLng.lat, longitude: self.latLng.lng } }).done(function () {
					resolve(self.nearbyRestaurants.toJSON());
				}).fail(function () {
					reject('Failed Nearby API');
				});
			});
			return promise;
		},
		getTextSearch: function (type) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.textSearchRestaurants.fetch({ method: 'POST', data: { latitude: self.latLng.lat, longitude: self.latLng.lng } }).done(function () {
					resolve(self.textSearchRestaurants);
				}).fail(function () {
					reject('Failed Text Search API');
				});
			});
			return promise;
		},
		getSingleRestaurant: function (markerId) {
			var self= this;
			var promise= new Promise(function(resolve, reject) {
				self.singleRestaurant.fetch({method: 'POST', data: {"__eatery_id": markerId}}).done(function() {
					resolve(self.singleRestaurant.toJSON());
				}).fail(function() {
					reject('Failed SINGLE Restaurant API');
				});
			});
			return promise;
		}
	});
	return DataService;
});