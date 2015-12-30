// This control the Router and controller of application.

define(function(require) {
   
   "use strict";
   
   var Marionette= require('marionette');
   
   var LandingPage= require('./landingPage/i-landingPage');
   var ApplicationPage= require('./applicationPage/l-applicationPage');
   
   var Router= Marionette.AppRouter.extend({
       initialize: function(opts) {
           this.region= opts.region;
       },
       routes: {
           "": "landingPage",
           "application": "application"
       },
       landingPage: function() {
           var landingPage= new LandingPage();
           this.region.show(landingPage);
       },
       application: function() {
           var applicationPage= new ApplicationPage();
           this.region.show(applicationPage);
       }
   });
   
   return Router;
});