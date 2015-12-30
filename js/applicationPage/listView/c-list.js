define(function(require) {
   
   "use strict";
   
   var Handlebars = require('handlebars');
   var Marionette = require('marionette');
   var Template = require('text!./restaurant.html');
   
   var RestaurantView = Marionette.ItemView.extend({
       template: Handlebars.compile(Template),
   });
   
   var RestaurantsListView = Marionette.CollectionView.extend({
       id: 'restaurants-list-view',
       childView: RestaurantView,
   });
   
   return RestaurantsListView; 
});