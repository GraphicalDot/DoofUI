define(function(require) {

   "use strict";

   var Handlebars= require('handlebars');
   var Marionette= require('marionette');
   var Template= require('text!./landingPage.html');

   var LandingPage= Marionette.ItemView.extend({
       id: 'landingPage',
       className: 'white-text center',
       template: Handlebars.compile(Template),
	   initialize: function(opts) {
		    // this.user.on('change', this.render, this);
	   },
	//    templateHelpers: function() {
	// 	   return {
	// 		   isLoggedIn: function() {
	// 			   return this.user.isAuthorized();
	// 		   }
	// 	   }
	//    }
   });

   return LandingPage;
});