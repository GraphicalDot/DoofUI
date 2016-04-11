define(function (require) {
	'use strict';

	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./applicationPage.html');

	var MapBoxView = require('./map/i-map');
	var SearchBoxView = require('./search/i-searchBox');
	var ListView = require('./list/c-list');

	var DataService = require('./../models/data-service');

	var ApplicationModel = Backbone.Model.extend();
	var ApplicationCollection = Backbone.Collection.extend({ model: ApplicationModel });

	var ApplicationPage = Marionette.LayoutView.extend({
		id: 'applicationPage',
		initialize: function (opts) {
			this.user = opts.user;
			this.latLng = opts.latLng ? opts.latLng : { lat: '28.6139', lng: '77.2090' },
			this.place = opts.place ? opts.place : 'New Delhi';
			this.dataService = new DataService();
			this.dataService.setup(this.latLng);


			this.collection = new ApplicationCollection();
			this.collection.on('reset', this.updateChildViewsData, this);

			if (opts.eateries) {
				this.collection.reset(opts.eateries);
			} else {
				this.showTrendingRestaurants();
			}

			this.mapBoxView = new MapBoxView({ latLng: this.latLng });
			this.listView = new ListView({ collection: this.collection });
			this.searchBoxView = new SearchBoxView({ place: this.place, latLng: this.latLng });
		},
		template: Handlebars.compile(Template),
		regions: {
			search: '.masthead__search-container',
			map: '.body__map-container',
			list: '.body__list'
		},
		ui: {
			'subMenuTabsWrapper': '.body__sub-menu',
			'subMenuTrendingLink': '#sub-menu__trending-link',
			'subMenuNearMeLink': '#sub-menu__nearme-link'
		},
		events: {
			'click @ui.subMenuTrendingLink': 'showTrendingRestaurants',
			'click @ui.subMenuNearMeLink': 'showNearMeRestaurants'
		},
		showTrendingRestaurants: function () {
			var self = this;
			this.dataService.getTrending().then(function (trendingRestaurants) {
				self.collection.reset(trendingRestaurants);
			}, function (error) {
				console.log('failed');
			});
		},
		showNearMeRestaurants: function () {
			var self = this;
			this.dataService.getNearby().then(function (nearMeRestaurants) {
				self.collection.reset(nearMeRestaurants);
			}, function (error) {
				console.log('failed');
			});
		},
		updateChildViewsData: function () {
			this.mapBoxView.showMarkers(this.collection.toJSON());
		},
		onShow: function () {
			var self= this;
			require(['tabs'], function() {
				self.ui.subMenuTabsWrapper.tabs();
			});

			this.showChildView('search', this.searchBoxView);
			this.showChildView('map', this.mapBoxView);
			this.showChildView('list', this.listView);
		}
	});

	return ApplicationPage;
});