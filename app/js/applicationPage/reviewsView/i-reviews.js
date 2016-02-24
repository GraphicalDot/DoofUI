define(function(require) {
	'use strict';

	var Marionette= require('marionette');
	var Handlebars= require('handlebars');
	var Template= require('text!./reviews.html');
	var EmptyTemplate= require('text!./empty_reviews.html');

	var Review= Marionette.ItemView.extend({
		tagName: 'li',
		template: Handlebars.compile(Template),
		templateHelpers: function() {
			return {
				first_name: function() {
					var name= this.model.get('name');
					return name.split(" ")[0];
				},
				user_image: function() {
					var picture= this.model.get('picture');
					if(!picture) {return 'css/images/placeholder_user.png';}
					return picture;
				}
			}
		},
	});

	var EmptyReview= Marionette.ItemView.extend({
		tagName: 'li',
		template: Handlebars.compile(EmptyTemplate)
	});

	var Reviews= Marionette.CollectionView.extend({
		childView: Review,
		emptyView: EmptyReview,
		tagName: 'ul',
		id: 'restaurant-reviews',
		className: 'reviews',
		isEmpty: function() {
			var data= this.collection.toJSON();
			if(data.length && data[0].__eatery_id) {
				return false;
			}
			return true;
		}
	});

	return Reviews;
});