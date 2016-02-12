define(function(require) {
	'use strict';

	var Backbone= require('backbone');

	var ApisModel= Backbone.Model.extend({
		url: "http://52.76.176.188:8000/apis",
		privateKey: "967d2b1f6111a198431532149879983a1ad3501224fb0dbf947499b1",
		initialize: function(opts) {
			if(opts.url) {this.url= opts.url};
		},
	});

	return ApisModel;
});