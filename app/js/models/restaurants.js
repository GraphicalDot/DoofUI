define(function(require) {
   
   "use strict";
   
   var _= require('underscore');
   var Backbone= require('backbone');
   
   var Restaurant= Backbone.Model.extend();
   console.log(window.get_trending);
   var Restaurants= Backbone.Collection.extend({
       model: Restaurant,
       url: window.get_trending,
       parse: function(response) {
           if(response.error) {return []};
           
           var output= [];
           _.each(["food", "ambience", "cost", "service"], function (category) {
               var categoryResult = response.result[category];
               _.each(categoryResult, function (result, i) {
                   result.category = category;
                   output.push(result);
               });
           });
           return output;
       }
   });
   
   return Restaurants;
});