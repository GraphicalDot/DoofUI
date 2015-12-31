define(function (require) {

    "use strict";

    var $ = require('jquery');
    var _ = require('underscore');
    var Handlebars = require('handlebars');
    var Marionette = require('marionette');
    var Template = require('text!./restaurant.html');

   	Handlebars.registerHelper('if_eq', function (a, b, opts) {
        if (a == b) {// Or === depending on your needs
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    });

    function escapeHtml(text) {
        return text
      .replace(/&amp;/g, '&');
    }

    var current_list = "";

    var RestaurantView = Marionette.ItemView.extend({
        className: 'restaurant-list-item',
        template: Handlebars.compile(Template),
        attributes: function () {
            return {
                'eatery-id': this.model.get('__eatery_id')
            };
        },
        events: {
            'mouseenter .restaurant-list': 'highlight',
            'mouseleave .restaurant-list': 'unhighlight',
            'click .restaurant-list': 'show'
        },
        highlight: function () {
            $(this.el).addClass('active');
            this.triggerMethod('highlightMarker:restaurant', this.model.get('__eatery_id'));
        },
        unhighlight: function () {
            $(this.el).removeClass('active');
            this.triggerMethod('unhighlightMarker:restaurant', this.model.get('__eatery_id'));
        },
        show: function () {
            this.triggerMethod('show:restaurant', this.model.get('__eatery_id'), this.model.toJSON());
        },
        templateHelpers: {
            newCategory: function () {
                if (current_list !== this.model.get('category')) {
                    current_list = this.model.get('category');
                    if(current_list) {
                        if (current_list === 'food') {
                            return { status: true, value: "Trending food in map" };
                        } else {
                            return { status: true, value: "Trending " + current_list + " restaurants in map" };
                        }    
                    } else {
                        return { status: false };
                    }
                } else {
                    return { status: false };
                }
            },
            isFood: function () {
                return this.model.get('category') === 'food';
            },
            sentiment: function () {
                var data = this.model.toJSON();
                var keys = ['excellent', 'good', 'average', 'poor', 'terrible'];
                var highest = '', highestValue = 0;
                _.each(keys, function (key, i) {
                    if (data[key] > highestValue) {
                        highest = key;
                        highestValue = data[key];
                    }
                });
                return highest;
            },
            escapedAddreess: function() {
                var eatery_details= this.model.get('eatery_details');
                var address= '';
                if(eatery_details) {
                    address= eatery_details.eatery_address;
                } else {
                    if(this.model.get('eatery_address')) {
                        address= this.model.get('eatery_address');
                    }    
                }
                
                return escapeHtml(address);
            },
            top_foods: function() {
                 var eatery_details= this.model.get('eatery_details');
                 var top_foods= '';
                 if(eatery_details && eatery_details.food.dishes.length) {
                    top_foods= eatery_details.food.dishes[0].name+ ', '+eatery_details.food.dishes[1].name+ ', '+ eatery_details.food.dishes[2].name    
                 }
                 
                 return top_foods; 
            }
        }
    });

    var RestaurantsListView = Marionette.CollectionView.extend({
        id: 'restaurants-list-view',
        childView: RestaurantView,
        updateCollection: function (newCollection) {
            this.collection = newCollection;
            this.render();
        }
    });

    return RestaurantsListView;
});