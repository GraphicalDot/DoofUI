define(function(require) {
   
   "use strict";
   
   var Handlebars= require('handlebars');
   var Marionette= require('marionette');
   var Template= require('text!./landingPage.html');
   
   var LandingPage= Marionette.ItemView.extend({
       id: 'landingPage',
       className: 'white-text center',
       template: Handlebars.compile(Template)
   });
   
   return LandingPage;
});