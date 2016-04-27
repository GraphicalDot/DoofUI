/* global Materialize */
define(function (require) {
	'use strict';

	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./applicationPage.html');

	var SearchBoxView = require('./search/i-searchBox');
	var UserView = require('./user/i-user');
	var ListView = require('./list/c-list');
	var MapBoxView = require('./map/i-map');
	var DetailView = require('./detail/i-detail');

	var ApplicationModel = Backbone.Model.extend();
	var ApplicationCollection = Backbone.Collection.extend({ model: ApplicationModel });

	var UserFeedbackModel = require('./../models/user_feedback');

	var ReviewsDataService = require('./../services/reviews-service');

	var ApplicationPage = Marionette.LayoutView.extend({
		id: 'applicationPage',
		initialize: function (opts) {
			//Options
			this.user = opts.user;
			this.latLng = opts.position ? opts.position.latLng : { lat: '28.6139', lng: '77.2090' },
			this.place = opts.position ? opts.position.place : 'New Delhi';
			this.startingEateries = opts.eateries;
			this.eateryCategory = opts.category;

			//Services
			this.dataService = opts.dataService;
			this.googleService = opts.googleService;
			this.reviewsService = new ReviewsDataService();

			//Collection
			this.collection = new ApplicationCollection(opts.eateries);
			this.collection.on('reset', this.updateGoogleMapsMarker, this);

			//Feedback Model
			this.userFeedback = new UserFeedbackModel();

			//Views
			this.searchBoxView = new SearchBoxView({ place: this.place, latLng: this.latLng, googleService: this.googleService });
			this.userView = new UserView({ model: this.user, userProfileRegion: this.getRegion('userProfile'), reviewsService: this.reviewsService });
			this.mapBoxView = new MapBoxView({ latLng: this.latLng });
			this.listView = new ListView({ collection: this.collection });
		},
		template: Handlebars.compile(Template),
		templateHelpers: {
			'isTrendingActive': function () {
				if (this.eateryCategory === 'trending') {
					return 'active';
				}
			},
			'isNearbyActive': function () {
				if (this.eateryCategory === 'nearyby') {
					return 'active';
				}
			},
			isAuthorized: function () {
				if (this.user.isAuthorized()) {
					return 'active';
				} else {
					return '';
				}
			},
			userName: function () {
				if (this.user.isAuthorized()) {
					return this.user.get('name');
				} else {
					return '';
				}
			},
			userEmail: function () {
				if (this.user.isAuthorized()) {
					return this.user.get('email')
				} else {
					return '';
				}
			}
		},
		regions: {
			userProfile: '.body__profile-box',
			userMenu: '.nav-menu-item__user',
			search: '.masthead__search-container',
			map: '.body__map-container',
			list: '.body__list',
			searchList: '.body__search-list',
			detail: '.body__detail-box',
		},
		ui: {
			'feedbackLink': '#nav-menu__feedback-link',
			'subMenuTabsWrapper': '.body__sub-menu',
			'subMenuTrendingLink': '#sub-menu__trending-link',
			'subMenuNearMeLink': '#sub-menu__nearme-link',
			'feedbackModal': '#feedback__modal',
			'feedbackName': '#feedback-name',
			'feedbackEmail': '#feedback-email',
			'feedbackBody': '#feedback-body'
		},
		events: {
			'click @ui.subMenuTrendingLink': 'showTrendingRestaurants',
			'click @ui.subMenuNearMeLink': 'showNearMeRestaurants',
			'submit form#feedback-form': 'submitFeedback',
		},
		childEvents: {
			'show:restaurant': 'openDetailViewRestaurant',
			'hightlight:marker': 'highlightGoogleMapMarker',
			'unhightlight:marker': 'unhighlightGoogleMapMarker',
			'highlight:list-item': 'highlightRestaurantListItem',
			'unhighlight:list-item': 'unhighlightRestaurantListItem',
			'showSearchResults': 'searchResults',
			'myLocation__changed:map': 'searchResults'
		},
		onShow: function () {
			var self = this;
			require(['leanModal', 'tabs', 'forms'], function () {
				self.ui.feedbackLink.leanModal();
				self.ui.subMenuTabsWrapper.tabs();
				Materialize.updateTextFields();
			});

			this.showChildView('userMenu', this.userView);
			this.showChildView('search', this.searchBoxView);
			this.showChildView('list', this.listView);
			this.showChildView('map', this.mapBoxView);

			if (this.startingEateries) {
				this.collection.reset(this.startingEateries);
			} else {
				this.showTrendingRestaurants();
			}
		},

		/**
		 * This function finds Trending Restaurants.
		 */
		showTrendingRestaurants: function () {
			var self = this;
			this.dataService.getTrending(this.latLng).then(function (trendingRestaurants) {
				self.collection.reset(trendingRestaurants);
			}, function (error) { console.log('failed'); });
		},
		/**
		 * This function finds Near Me Restaurants.
		 */
		showNearMeRestaurants: function () {
			var self = this;
			this.dataService.getNearby(this.latLng).then(function (nearMeRestaurants) {
				self.collection.reset(nearMeRestaurants);
			}, function (error) { console.log('failed'); });
		},
		/**
		 * This function open Detail View for a Restaurant.
		 * @param restaurant_id -> Unique ID of Restaurant
		 * @param restaurant_info -> Earlier meta information of Restaurant.
		 */
		openDetailViewRestaurant: function (childView, restaurant_id, restaurant_info) {
			var self = this;
			this.dataService.getSingleRestaurant(restaurant_id).then(function (restaurant_details) {
				var detailView = new DetailView({ model: restaurant_details, user: self.user, restaurant_detail: restaurant_info, reviewsService: self.reviewsService });
				self.showChildView('detail', detailView);
			}, function (error) { console.log(error); });
		},

		updateGoogleMapsMarker: function () {
			this.mapBoxView.showMarkers(this.collection.toJSON());
			this.mapBoxView.updateMyLocationMarker();
		},

		searchResults: function (childView, eateries, newLatLng) {
			this.latLng.lat = newLatLng.lat;
			this.latLng.lng = newLatLng.lng;
			if (eateries && eateries.length) {
				this.collection.reset(eateries);
			} else {
				if (this.ui.subMenuNearMeLink.hasClass('active')) {
					this.showNearMeRestaurants();
				} else {
					this.showTrendingRestaurants();
				}
			}
		},

		/**
		 * Function for submitted Feedback
		 */
		submitFeedback: function (e) {
			var self = this;
			e.preventDefault();
			if (this.ui.feedbackName.val() && this.ui.feedbackEmail.val() && this.ui.feedbackBody.val()) {
				this.userFeedback.fetch({ method: 'POST', data: { fb_id: this.user.get('id'), "feedback": this.ui.feedbackBody.val(), "name": this.ui.feedbackName.val(), "email": this.ui.feedbackEmail.val() } }).then(function (response) {
					var toast_message = ''
					if (response.success) {
						self.ui.feedbackModal.closeModal();
						self.ui.feedbackBody.val('');
						toast_message = response.messege ? response.messege : "Thank you for submitting Feedback";
					} else {
						toast_message = "Sorry, some error.. Try again later..";
					}
					require(['toasts'], function () {
						Materialize.toast("Thank you for submitted Feedback", 3000);
					});
				});
			}
		},

		//Highlighters
		highlightGoogleMapMarker: function (childView, markerId) {
			this.mapBoxView.highlight(markerId);
		},
		unhighlightGoogleMapMarker: function () {
			this.mapBoxView.unhighlight();
		},
		highlightRestaurantListItem: function (childView, markerId) {
			this.listView.highlight(markerId);
		},
		unhighlightRestaurantListItem: function () {
			this.listView.unhighlight();
		},


	});

	return ApplicationPage;
});