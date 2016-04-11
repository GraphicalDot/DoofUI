define(function (require) {
	'use strict';

	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./applicationPage.html');

	var MapBoxView= require('./map/i-map');
	var SearchBoxView = require('./search/i-searchBox');

	var DataService = require('./../models/data-service');

	var ApplicationModel= Backbone.Model.extend();
	var ApplicationCollection = Backbone.Collection.extend({model: ApplicationModel});

	var ApplicationPage = Marionette.LayoutView.extend({
		id: 'applicationPage',
		initialize: function (opts) {
			var self= this;
			this.user = opts.user;
			this.latLng = opts.latLng ? opts.latLng : { lat: '28.6139', lng: '77.2090' },
			this.place = opts.place ? opts.place : 'New Delhi';
			this.dataService = new DataService();
			this.dataService.setup(this.latLng);


			this.collection = new ApplicationCollection();
			console.log(this.collection);
			this.collection.on('reset', this.updateChildViewsData, this);

			if (opts.eateries) {
				this.collection.reset(opts.eateries);
			} else {
				this.dataService.getTrending().then(function(trendingRestaurants) {
					self.collection.reset(trendingRestaurants);
					// console.log(self.collection);
				}, function(error) {
					console.log('failed');
				});
			}

			this.mapBoxView = new MapBoxView({ latLng: this.latLng });
			this.searchBoxView = new SearchBoxView({ place: this.place, latLng: this.latLng });
		},
		template: Handlebars.compile(Template),
		regions: {
			search: '.masthead__search-container',
			map: '.body__map-container'
		},
		updateChildViewsData: function () {
			console.log('updating data here');
			this.mapBoxView.showMarkers(this.collection.toJSON());
		},
		onShow: function () {
			this.showChildView('search', this.searchBoxView);
			this.showChildView('map', this.mapBoxView);
		}
	});

	return ApplicationPage;
});