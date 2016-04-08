define(function(require) {
	'use strict';

	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./applicationPage.html');

	var SearchBoxView= require('./search/i-searchBox');

	var DataService= require('./../models/data_service');

	var ApplicationPage = Marionette.LayoutView.extend({
		id: 'applicationPage',
		initialize: function(opts) {
			this.user= opts.user;
			this.latLng= opts.latLng ? opts.latLng : {lat: '28.6139', lng: '77.2090'},
			this.place= opts.place ? opts.place : 'New Delhi';
			this.dataService= new DataService();
			this.dataService.setup(this.latLng);
			console.log(this.dataService.getTrending());
			if(opts.eateries) {
				this.collection= opts.eateries;
			} else {
				// this.collection= new
			}

			this.searchBoxView= new SearchBoxView({place: this.place, latLng: this.latLng});
		},
		template: Handlebars.compile(Template),
		regions: {
			search: '.masthead__search-container'
		},
		onShow: function() {
			this.showChildView('search', this.searchBoxView);
		}
	});

	return ApplicationPage;
});