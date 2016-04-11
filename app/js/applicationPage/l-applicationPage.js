define(function (require) {
	'use strict';

	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./applicationPage.html');

	var SearchBoxView = require('./search/i-searchBox');

	var DataService = require('./../models/data-service');

	var ApplicationCollection = Backbone.Collection.extend({});

	var ApplicationPage = Marionette.LayoutView.extend({
		id: 'applicationPage',
		initialize: function (opts) {
			this.user = opts.user;
			this.latLng = opts.latLng ? opts.latLng : { lat: '28.6139', lng: '77.2090' },
			this.place = opts.place ? opts.place : 'New Delhi';

			this.dataService = new DataService();
			this.dataService.setup(this.latLng);

			this.collection = new ApplicationCollection();
			this.collection.on('reset', this.updateChildViewsData);

			if (opts.eateries) {
				this.collection.reset(opts.eateries);
			} else {
				this.dataService.getTrending(function (trendingRestaurants) {
					self.collection.reset(trendingRestaurants);
				}, function (reject) {
					console.log('failed');
				});
			}

			this.searchBoxView = new SearchBoxView({ place: this.place, latLng: this.latLng });
		},
		template: Handlebars.compile(Template),
		regions: {
			search: '.masthead__search-container'
		},
		updateChildViewsData: function () {
			console.log('updating data here');
		},
		onShow: function () {
			this.showChildView('search', this.searchBoxView);
		}
	});

	return ApplicationPage;
});