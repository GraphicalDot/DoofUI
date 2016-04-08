define(function(require) {
	'use strict';

	var Marionette= require('marionette');

	var DataService= Marionette.Service.Extend({
		setup: function(opts) {
			this.latLng= opts.latLng;
		},
		requests: {
			'getTrending': 'getTrending',
		},
		getTrending: function() {
			return 'hallo';
		}
	});
	return DataService;
});