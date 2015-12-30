define(function(require) {
   
   "use strict";
    
    var Backbone= require('backbone');
    var Marionette= require('marionette');
    
    var Router= require('./router');
    
    var Doof= new Marionette.Application();
    Doof.addRegions({region: '.doof'})
    
    Doof.on("before:start", function() {
        // find token here.
        
    });
    
    Doof.on("start", function() {
       
       new Router({region: Doof.region});
        if(Backbone.history) {
            Backbone.history.start();
        }
    });
    
    return Doof;
});