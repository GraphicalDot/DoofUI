define(function(require) {

	"use strict";

	var Handlebars= require('handlebars');
	var Marionette= require('marionette');
	var EmptyTemplate= require('text!./empty_review.html');
	var Template= require('text!./review.html');

	var EmptyReview= Marionette.ItemView.extend({
		tagName: 'li',
		className: 'empty-reviws',
		template: Handlebars.compile(EmptyTemplate)
	});

	var Review= Marionette.ItemView.extend({
		tagName: 'li',
		template: Handlebars.compile(Template),
		templateHelpers: {
			first_name: function() {
				var current_name= this.model.get('name');
				var first_name= current_name.split(" ")[0];
				return first_name;
			},
			user_image: function() {
				var picture= this.model.get('picture');
				if(picture) {return picture;}
				else {
					return 'css/images/placeholder_user.png';
				}
			}
		}
	});

	var Reviews= Marionette.CollectionView.extend({
		childView: Review,
		emptyView: EmptyReview,
		isEmpty: function() {
			var current_data= this.collection.toJSON();
			if(current_data.length) {
				if(current_data[0] && current_data[0].__eatery_id) {
					return false;
				}
			}
			return true;
		},
		tagName: 'ul',
		className: 'reviews',
	});

	return Reviews;
});