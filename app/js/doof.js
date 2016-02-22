define(function (require) {
	"use strict";

	var Backbone = require('backbone');
	var Marionette = require('marionette');

	var FacebookUser = require('./models/facebookUser');
	var Router = require('./router');
	// var GetKeyModel= require('./models/getkey');
	// var ApisModel = require('./models/apis');

	var Doof = new Marionette.Application();
	Doof.addRegions({ region: '.doof' })

	Doof.on("before:start", function () {
		// find token here. Going to be done later.
		// var key= new GetKeyModel();
		// key.fetch({data: { secret: "967d2b1f6111a198431532149879983a1ad3501224fb0dbf947499b1" }, type: 'POST'});
		// var apis = new ApisModel();
		// var pkey = apis.get('privateKey');
		// apis.fetch({ data: { "key": pkey }, type: 'POST' });
	});

	Doof.on("start", function () {
		//wait for facebook to hide loading and continue.
		var fbUser = new FacebookUser();
		fbUser.init().then(function () {
			return fbUser.checkLogin();
		}).then(function () {
			return fbUser.fetchInfo();
		}).then(function () {
			fbUser.sendUserData();
			Doof.router = new Router({ region: Doof.region, user: fbUser });
			if (Backbone.history) {
				Backbone.history.start();
			}
		}).catch(console.log.bind(console));
	});

	return Doof;
});