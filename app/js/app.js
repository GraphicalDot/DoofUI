define(function (require) {

	var Backbone = require('backbone');
	var Marionette = require('marionette');

	var App = new Marionette.Application();

	App.on("start", function () {
		console.log("Yahoo");
		if (Backbone) { Backbone.history.start() };
	});

	return App;
});