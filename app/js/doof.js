define(function (require) {
	"use strict";

	var Backbone = require('backbone');
	var Marionette = require('marionette');

	var LoaderView = require('./loader/i-loader');
	var FacebookUser = require('./models/facebookUser');
	var Router = require('./router');

	var Doof = new Marionette.Application();
	Doof.addRegions({ region: '.doof' })

	Doof.on("before:start", function () {
		// Check For Facebook Login Status.
		var fbUser = new FacebookUser();
		fbUser.init()
			.then(function () { return fbUser.checkLogin(); })
			.then(function () { return fbUser.fetchInfo(); })
			.then(function () {
				fbUser.sendUserData();
				Doof.vent.trigger("start:app", fbUser);
			})
			.catch(console.log.bind(console));
	});

	Doof.vent.bind("start:app", function (fbUser) {
		Doof.router = new Router({ region: Doof.region, user: fbUser });
		if (Backbone.history) {
			Backbone.history.start();
		}
		//wait for facebook to hide loading and continue.
	});

	return Doof;
});

// Pending
// var key= new GetKeyModel(); key.fetch({data: { secret: "967d2b1f6111a198431532149879983a1ad3501224fb0dbf947499b1" }, type: 'POST'});
// var apis = new ApisModel(); var pkey = apis.get('privateKey'); apis.fetch({ data: { "key": pkey }, type: 'POST' });