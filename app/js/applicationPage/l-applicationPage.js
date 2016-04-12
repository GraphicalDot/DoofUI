define(function (require) {
	'use strict';

	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./applicationPage.html');

	var UserView= require('./user/i-user');
	var MapBoxView = require('./map/i-map');
	var SearchBoxView = require('./search/i-searchBox');
	var ListView = require('./list/c-list');
	var DetailView= require('./detail/i-detail');

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

			this.userView= new UserView({model: this.user, userProfileRegion: this.getRegion('userProfile')});
			this.mapBoxView = new MapBoxView({ latLng: this.latLng });
			this.listView = new ListView({ collection: this.collection });
			this.searchBoxView = new SearchBoxView({ place: this.place, latLng: this.latLng });
		},
		template: Handlebars.compile(Template),
		regions: {
			userProfile: '.body__profile-box',
			userMenu: '.nav-menu-item__user',
			search: '.masthead__search-container',
			map: '.body__map-container',
			list: '.body__list',
			detail: '.body__detail-box',
		},
		ui: {
			'feedbackLink': '#nav-menu__feedback-link',
			'subMenuTabsWrapper': '.body__sub-menu',
			'subMenuTrendingLink': '#sub-menu__trending-link',
			'subMenuNearMeLink': '#sub-menu__nearme-link'
		},
		events: {
			'click @ui.subMenuTrendingLink': 'showTrendingRestaurants',
			'click @ui.subMenuNearMeLink': 'showNearMeRestaurants'
		},
		childEvents: {
			'show:restaurant': 'openDetailViewRestaurant',
			'hightlight:marker': 'highlightGoogleMapMarker',
			'unhightlight:marker': 'unhighlightGoogleMapMarker',
			'highlight:list-item': 'highlightRestaurantListItem',
			'unhighlight:list-item': 'unhighlightRestaurantListItem',
		},
		highlightGoogleMapMarker: function(childView, markerId) {
			this.mapBoxView.highlight(markerId);
		},
		unhighlightGoogleMapMarker: function() {
			this.mapBoxView.unhighlight();
		},
		highlightRestaurantListItem: function(childView, markerId) {
			this.listView.highlight(markerId);
		},
		unhighlightRestaurantListItem: function() {
			this.listView.unhighlight();
		},
		openDetailViewRestaurant: function(childView, restaurant_id, restaurant_info) {
			var self= this;
			this.dataService.getSingleRestaurant(restaurant_id).then(function(restaurant_details) {
				var detailView= new DetailView({model: restaurant_details, user: self.user, restaurant_detail: restaurant_info});
				self.showChildView('detail', detailView);
			}, function(error) { console.log(error); });
		},
		showTrendingRestaurants: function () {
			var self = this;
			this.dataService.getTrending().then(function (trendingRestaurants) {
				self.collection.reset(trendingRestaurants);
			}, function (error) { console.log('failed'); });
		},
		showNearMeRestaurants: function () {
			var self = this;
			this.dataService.getNearby().then(function (nearMeRestaurants) {
				self.collection.reset(nearMeRestaurants);
			}, function (error) { console.log('failed'); });
		},
		updateChildViewsData: function () {
			this.mapBoxView.showMarkers(this.collection.toJSON());
		},
		onShow: function () {
			var self = this;
			require(['leanModal', 'tabs'], function () {
				self.ui.feedbackLink.leanModal();
				self.ui.subMenuTabsWrapper.tabs();
			});

			this.showChildView('userMenu', this.userView);
			this.showChildView('search', this.searchBoxView);
			this.showChildView('map', this.mapBoxView);
			this.showChildView('list', this.listView);
		}
	});

	return ApplicationPage;
});