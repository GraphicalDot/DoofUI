// This control the Router and controller of application.

define(function(require) {

   "use strict";

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
           var landingPage= new LandingPage({user: this.user});
           this.region.show(landingPage);
       },
       application: function() {
           var applicationPage= new ApplicationPage({user: this.user});
           this.region.show(applicationPage);
       }
   });

   return Router;
});