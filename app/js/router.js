// This control the Router and controller of application.

define(function(require) {

   "use strict";

   var $= require('jquery');
   var Marionette= require('marionette');

   var LandingPage= require('./landingPage/i-landingPage');
   var ApplicationPage= require('./applicationPage/l-applicationPage');

   var Router= Marionette.AppRouter.extend({
       initialize: function(opts) {
           this.region= opts.region;
		   this.user= opts.user;
       },
       routes: {
           "": "landingPage",
           "application": "application"
       },
       landingPage: function() {
		   var self= this;
           var landingPage= new LandingPage({user: this.user});
           this.region.show(landingPage);
		   landingPage.on("goToApplication", function(position, address) {
			   self.application(position, address);
		   });
		   $('.loader').velocity("fadeOut");
       },
       application: function(position, address) {
           var applicationPage= new ApplicationPage({user: this.user, position: position, address: address});
           this.region.show(applicationPage);
		   $('.loader').velocity("fadeOut");
       }
   });

   return Router;
});