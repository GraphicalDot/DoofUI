define(function(require) {
	'use strict';

	var Backbone= require('backbone');

	var GetEatery= Backbone.Model.extend({
		url: "http://52.76.176.188:8000/geteatery",
		parse: function(response) {
			if(response.error) {return []};
			return response.result;
		}
	});

	return GetEatery;
});