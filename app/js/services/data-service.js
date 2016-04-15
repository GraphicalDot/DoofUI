define(function (require) {
	'use strict';

	var Service = require('marionette-service');
	var Promise = require('es6promise').Promise;

	var TrendingRestaurants = require('./../models/restaurant_data/get_trending');
	var NearbyRestaurants = require('./../models/restaurant_data/nearest_eateries');
	var SingleRestaurant = require('./../models/restaurant_data/geteatery');

	var DataService = Service.extend({
		initialize: function () {
			this.trendingRestaurants = new TrendingRestaurants();
			this.nearbyRestaurants = new NearbyRestaurants();
			this.singleRestaurant = new SingleRestaurant();
		},
		requests: {
			'isDataAvailable': 'checkIfDataAvailable',
			'getTrending': 'getTrending',
			'getNearby': 'getNearby',
			'getSingleRestaurant': 'getSingleRestaurant'
		},
		/* This request checks if data is available at given lat lng..
		 * First check trending Restaurants at that place, if none is found then check nearBy restarants..
		 * If data is not found either, reject requeest.
		 * */
		checkIfDataAvailable: function (latLng) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.getTrending(latLng)
					.then(function (trendingRestaurants) {
						if (trendingRestaurants.length) {
							resolve({ status: 'trending', restaurants: trendingRestaurants });
						} else {
							return self.getNearby(latLng);
						}
					})
					.then(function (nearByRestaurants) {
						if (nearByRestaurants.length) {
							resolve({ status: 'nearby', restaurants: nearByRestaurants });
						} else {
							reject();
						}
					})
					.catch(function () { reject(); });
			});
			return promise;
		},
		/*
 		 * This finds the Trending Restaurants at given Lat Lng
		*/
		getTrending: function (latLng) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.trendingRestaurants.fetch({ method: 'POST', data: { latitude: latLng.lat, longitude: latLng.lng } }).done(function () {
					resolve(self.trendingRestaurants.toJSON());
				}).fail(function () {
					reject('Failed Trending API');
				});
			});
			return promise;
		},
		/*
 		 * This finds the NearBy Restaurants at given Lat Lng
		*/
		getNearby: function (latLng) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.nearbyRestaurants.fetch({ method: 'POST', data: { latitude: latLng.lat, longitude: latLng.lng } }).done(function () {
					resolve(self.nearbyRestaurants.toJSON());
				}).fail(function () {
					reject('Failed Nearby API');
				});
			});
			return promise;
		},
		/*
 		 * This finds the Single Restaurants at given Restaurant ID
		*/
		getSingleRestaurant: function (restaurant_id) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.singleRestaurant.fetch({ method: 'POST', data: { "__eatery_id": restaurant_id } }).done(function () {
					resolve(self.singleRestaurant);
				}).fail(function () {
					reject('Failed SINGLE Restaurant API');
				});
			});
			return promise;
		}
	});
	return DataService;
});