define(function (require) {
	'use strict';

	var Service = require('marionette-service');
	var Promise = require('es6promise').Promise;

	var TrendingRestaurants = require('./get_trending');
	var NearbyRestaurants = require('./nearest_eateries');
	var TextSearchRestaurants = require('./text_search');

	var DataService = Service.extend({
		initialize: function () {
			this.trendingRestaurants = new TrendingRestaurants();
			this.nearbyRestaurants = new NearbyRestaurants();
			this.textSearchRestaurants = new TextSearchRestaurants();
		},
		setup: function (latLng) {
			this.latLng = latLng;
		},
		requests: {
			'getTrending': 'getTrending',
			'getNearby': 'getNearby',
			'getTextSearch': 'getTextSearch'
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
					resolve(self.nearbyRestaurants);
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
		}
	});
	return DataService;
});