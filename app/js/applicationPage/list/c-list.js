define(function (require) {
	'use strict';

	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Template = require('text!./list-item.html');

	var ListItem = Marionette.ItemView.extend({
		className: 'list-item',
		template: Handlebars.compile(Template),
		templateHelpers: {
			foodBlock: function () {
				return this.model.get('category') === 'food';
			}
		},
	});

	var EmptyList = Marionette.ItemView.extend({
		className: 'empty-list',
		initialize: function () {
			this.template = Handlebars.compile('<img src="css/images/no-review.png" alt="" class="responsive-img"><span>No Restaurants found</span>');
		}
	});

	var List = Marionette.CollectionView.extend({
		id: 'doof-list',
		emptyView: EmptyList,
		childView: ListItem
	});

	return List;
});