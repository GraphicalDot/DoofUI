define(function (require) {
	'use strict';

	var Service = require('marionette-service');
	var Promise = require('es6promise').Promise;

	// Model for getting Suggestions
	var SuggestionsModel = require('./../models/text-search/suggestions');
	// Model for searching Restaurants List by Text
	var TextSearchModel = require('./../models/text-search/text_search');

	var TextSearchService = Service.extend({
		initialize: function () {
			this.suggestionsModel = new SuggestionsModel();
			this.model = new TextSearchModel();
		},
		requests: {
			'getSuggestions': 'getSuggestions',
			'getByFood': 'getByFood',
			'getByCuisine': 'getByCuisine',
			'getByRestaurantName': 'getByRestaurantName'
		},
		// Get Suggestions based on typed text..
		getSuggestions: function (text) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.suggestionsModel.fetch({ method: 'POST', data: { query: text } }).then(function () {
					resolve(self.suggestionsModel.toJSON());
				}).fail(function () {
					reject('Cannot Get Suggestions');
				});
			});
			return promise;
		},
		// Get Restaurants serving searched food name in given lat lng
		getByFood: function (food_name, lat, lng) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.model.fetch({ method: 'POST', data: { type: 'dish', text: food_name, lat: lat, lng: lng } }).then(function () {
					resolve(self.model.toJSON());
				}).fail(function () {
					reject('Cannot fetch Restaurants by Dish');
				});
			});
			return promise;
		},
		// Get Restaurants serving searched cuisine name in given lat lng
		getByCuisine: function (cuisine_name, lat, lng) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.model.fetch({ method: 'POST', data: { type: 'cuisine', text: cuisine_name, lat: lat, lng: lng } }).then(function () {
					resolve(self.model.toJSON());
				}).fail(function () {
					reject('Cannot fetch Restaurants by Cuisine');
				});
			});
			return promise;
		},
		// Get Restaurants with given name in given lat lng
		getByRestaurantName: function (restaurant_name, lat, lng) {
			var self = this;
			var promise = new Promise(function (resolve, reject) {
				self.model.fetch({ method: 'POST', data: { type: 'eatery', text: restaurant_name, lat: lat, lng: lng } }).then(function () {
					resolve(self.model.toJSON());
				}).fail(function () {
					reject('Cannot fetch Restaurants by Restaurant Name');
				});
			});
			return promise;
		}
	});

	return TextSearchService;
});