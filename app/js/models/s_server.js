define(function (require) {
	'use strict';

	var Service = require('marionette-service');
	var Promise = require('es6promise').Promise;

	var ServerService = Service.extend({
		initialize: function () {
			this.pkey = '967d2b1f6111a198431532149879983a1ad3501224fb0dbf947499b1';
		},
		getJwt: function () {
			var promise = new Promise(function (resolve, reject) {
				resolve();
			});
			return promise;
		},
		getApis: function () {
			var promise = new Promise(function (resolve, reject) {
				resolve();
			});
			return promise;
		},
	});

	return ServerService;
});