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
			},
			sentiment: function () {
				var terrible, poor, average, mix, good, excellent, total_sentiments = 0;
				if (this.model.get('category') === 'food') {
					terrible = this.model.get('terrible') ? this.model.get('terrible') : 0;
					poor = this.model.get('poor') ? this.model.get('poor') : 0;
					average = this.model.get('average') ? this.model.get('average') : 0;
					mix = this.model.get('mix') ? this.model.get('mix') : 0;
					good = this.model.get('good') ? this.model.get('good') : 0;
					excellent = this.model.get('excellent') ? this.model.get('excellent') : 0;
					total_sentiments = this.model.get('total_sentiments') ? this.model.get('total_sentiments') : 1;
				} else {
					terrible = this.model.get('eatery_details').overall.terrible ? this.model.get('eatery_details').overall.terrible : 0;
					poor = this.model.get('eatery_details').overall.poor ? this.model.get('eatery_details').overall.poor : 0;
					average = this.model.get('eatery_details').overall.average ? this.model.get('eatery_details').overall.average : 0;
					mix = this.model.get('eatery_details').overall.mix ? this.model.get('eatery_details').overall.mix : 0;
					good = this.model.get('eatery_details').overall.good ? this.model.get('eatery_details').overall.good : 0;
					excellent = this.model.get('eatery_details').overall.excellent ? this.model.get('eatery_details').overall.excellent : 0;
					total_sentiments = this.model.get('eatery_details').overall.total_sentiments ? this.model.get('eatery_details').overall.total_sentiments : 1;
				}

				// console.log(this.model.get('eatery_details').eatery_name, terrible, poor, average, mix, good, excellent, total_sentiments);
				return ((0 * terrible + 2.5 * poor + 4.8 * average + 5.2 * mix + 7.5 * good + 10 * excellent) / total_sentiments).toFixed(1);
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