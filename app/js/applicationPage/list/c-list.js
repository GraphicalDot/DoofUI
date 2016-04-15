define(function (require) {
	'use strict';

	var $ = require('jquery');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./list-item.html');

	var ListItem = Marionette.ItemView.extend({
		className: 'list-item',
		template: Handlebars.compile(Template),
		attributes: function () {
			return {
				'eatery-id': this.model.get('eatery_details')['__eatery_id']
			}
		},
		templateHelpers: {
			foodBlock: function () {
				return this.model.get('category') === 'food';
			}
		},
		ui: {
			'photo': '.photo',
			'content': '.mata-information'
		},
		events: {
			'click @ui.photo': 'showRestaurant',
			'mouseenter @ui.photo': 'highlightThis',
			'mouseleave @ui.photo': 'unhighlightThis',
			'click @ui.content': 'showRestaurant',
			'mouseenter @ui.content': 'highlightThis',
			'mouseleave @ui.content': 'unhighlightThis'
		},
		showRestaurant: function (e) {
			e.preventDefault();
			this.triggerMethod('show:restaurant', this.model.get('__eatery_id'), this.model.toJSON());
		},
		highlightThis: function (e) {
			e.preventDefault();
			this.$el.addClass('active');
			this.triggerMethod('hightlight:marker', this.model.get('__eatery_id'));
		},
		unhighlightThis: function (e) {
			e.preventDefault();
			this.$el.removeClass('active');
			this.triggerMethod('unhightlight:marker');
		}
	});

	var EmptyList = Marionette.ItemView.extend({
		className: 'empty-list',
		initialize: function () {
			this.template = Handlebars.compile('<img src="css/images/no-review.png" alt="" class="responsive-img"><span>No Restaurants found</span>');
		}
	});

	var List = Marionette.CollectionView.extend({
		id: 'doof-list',
		className: 'doof-list-item',
		emptyView: EmptyList,
		childView: ListItem,
		highlight: function (markerId) {
			this.unhighlight();
			var $target = this.$el.find('.list-item[eatery-id="' + markerId + '"]');
			$target.addClass('active');
			$target.velocity("scroll", {
				container: $('.doof-list-item'),
				duration: 500,
				offset: -180,
				easing: "ease-in-out"
			});
		},
		unhighlight: function () {
			this.$el.find('.list-item').removeClass('active');
		},
	});

	return List;
});