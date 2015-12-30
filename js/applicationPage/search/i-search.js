define(function (require) {

    "use strict";

    var $ = require('jquery');
    var Handlebars = require('handlebars');
    var Marionette = require('marionette');
    var Template = require('text!./search.html');

	var SearchModel= require('./../../models/search');

    var SearchBox = Marionette.ItemView.extend({
        id: 'doof-search-view',
        template: Handlebars.compile(Template),
		initialize: function() {
			this.model= new SearchModel();
		},
		events: {
			'click .clear_button': 'clearSearch'
		},
		clearSearch: function () {
			$("#doof_search_box").val('');
			this.triggerMethod('show:restaurants');
		},
		onCuisineSelect: function(cuisine_name) {
			var self= this;
			if(!cuisine_name) {
				this.clearSearch();
				return;
			}
			this.model.fetch({method: 'POST', data: {type: 'cuisine', text: cuisine_name}}).then(function() {
				self.triggerMethod('show:restaurants', self.model);
			});
		},
		onFoodSelect: function (food_name) {
			var self = this;
			if (!food_name) {
				this.clearSearch();
				return;
			}
			this.model.fetch({method: 'POST', data: {type: 'dish', text: food_name}}).then(function() {
				self.triggerMethod('show:restaurants', self.model);
			});
		},
		onRestaurantSelect: function (restaurant_name) {
			var self = this;
			if (!restaurant_name) {
				this.clearSearch();
				return;
			}
			this.model.fetch({method: 'POST', data: {type: 'eatery', text: restaurant_name}}).then(function() {
				console.log(self.model);
				self.triggerMethod('show:restaurant', self.model);

			});
		},
		onNullSelect: function(value) {
			var self = this;
			if (!value) {
				this.clearSearch();
				return;
			}
			this.model.fetch({method: 'POST', data: {type: null, text: value}}).then(function() {
				self.triggerMethod('show:restaurants', self.model);
			});
		},
        onShow: function () {
			var self= this;
            require(['typeahead'], function () {
                $("#doof_search_box").typeahead(
                    { hint: true, highlight: true, minLength: 4 },
                    { limit: 12, async: true,
                        source: function (query, processSync, processAsync) {
                            return $.ajax({
                                url: window.get_suggestions,
                                type: 'POST',
                                data: { query: query },
                                dataType: 'json',
                                success: function (json) {
                                    return processAsync(json.result[0].suggestions)
                                }
                            });
                        },
                        templates: {
                            empty: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No food found', '</div>'].join('\n'),
                            suggestion: function (data) {
                                var str = data.replace(/\s+/g, '');
                                return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
                            },
                            header: '<i class="material-icons suggestion-type typeahead-header food">kitchen</i><span>Food</span>'
                        }
                    }, {
                        limit: 12,
                        async: true,
                        source: function (query, processSync, processAsync) {
                            return $.ajax({
                                url: window.get_suggestions,
                                type: 'POST',
                                data: { query: query },
                                dataType: 'json',
                                success: function (json) {
                                    return processAsync(json.result[1].suggestions)
                                }
                            });
                        },
                        templates: {
                            empty: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No Restaurant found', '</div>'].join('\n'),
                            suggestion: function (data) {
                                var str = data.replace(/\s+/g, '');
                                return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
                            },
                            header: '<i class="material-icons suggestion-type typeahead-header restaurant">kitchen</i><span>Restaurant</span>'
                        }
                    }, {
                        limit: 12,
                        async: true,
                        source: function (query, processSync, processAsync) {
                            return $.ajax({
                                url: window.get_suggestions,
                                type: 'POST',
                                data: { query: query },
                                dataType: 'json',
                                success: function (json) {
                                    return processAsync(json.result[2].suggestions)
                                }
                            });
                        },
                        templates: {
                            empty: ['<div class="empty-message"><i class="material-icons empty_message_icon">do_not_disturb</i>', 'No Cuisines found', '</div>'].join('\n'),
                            suggestion: function (data) {
                                var str = data.replace(/\s+/g, '');
                                return '<div class="typeahead-suggestion-' + str + '"><strong>' + data + '</strong></div>';
                            },
                            header: '<i class="material-icons suggestion-type typeahead-header cuisine">kitchen</i><span>Cuisines</span>'
                        }
                    }
                ).on('typeahead:asyncrequest', function () {
                    // $('.Typeahead-spinner').show();
                }).on('typeahead:asynccancel typeahead:asyncreceive', function () {
                    // $('.Typeahead-spinner').hide();
                });
				$("#doof_search_box").bind("typeahead:select", function (ev, suggestion) {

					var str = suggestion.replace(/\s+/g, '');
					var $suggestionEl = $('.typeahead-suggestion-' + str);
					var $headerEl = $suggestionEl.closest('.tt-dataset').find('.typeahead-header');

					if ($headerEl.hasClass('food')) {
						self.onFoodSelect(suggestion);
					} else if($headerEl.hasClass('cuisine')) {
						self.onCuisineSelect(suggestion);
					} else {
						self.onRestaurantSelect(suggestion);
					}
				});

				$("#doof_search_box").enterKey(function (e) {
					if ($(this).val()) {
						self.onNullSelect($(this).val());
					} else {
						self.clearSearch();
					}
				});
            });
        }
    });

    return SearchBox;
});