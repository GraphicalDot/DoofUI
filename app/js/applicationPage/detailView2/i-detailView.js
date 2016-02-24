define(function(require) {
	'use strict';

	var Marionette= require('marionette');
	var Handlebars= require('handlebars');
	var Template= require('text!./detailView.html');

	var ReviewsCollection= require('./../../models/fetch_review');
	var ReviewsView= require('./../reviewsView/i-reviews');

	var DetailView= Marionette.ItemView.extend({
		id: 'detail-view',
		template: Handlebars.compile(Template),
		initialize: function(opts) {
			this.restaurant_detail= opts.restaurant_detail;
			this.user= opts.user;

			this.reviewsRegion= new Marionette.Region({
				el: '#reviews-tab'
			});
			this.reviews= new ReviewsCollection();
			this.reviewsView= new ReviewsView({collection: this.reviews, __eatery_id: this.restaurant_detail.__eatery_id});
		},
		templateHelpers: function() {
			return {
				'restaurant-name': this.restaurant_detail.eatery_details.eatery_name,
				'restaurant-address': this.restaurant_detail.eatery_details.eatery_address,
			}
		},
		ui: {
			'tabs': '.restaurant-details__tabs',
			'reviewBox': ".reviews-list"
		},
		onShow: function() {
			var self= this;
			this.ui.tabs.tabs();
			$('.detail').removeClass('hide');

			this.reviews.fetch({ method: 'POST', data: { __eatery_id: this.restaurant_detail.__eatery_id } }).then(function () {
				self.reviewsView.render();
				$(self.ui.reviewBox).html(self.reviewsView.el);
			});
		},
	});

	return DetailView;
});