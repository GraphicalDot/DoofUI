define(function(require) {
	'use strict';

	var Backbone= require('backbone');

	var UserDetailsModel= Backbone.Model.extend({
		url: "http://52.76.176.188:8000/usersdetails"
	});
	return UserDetailsModel;
});