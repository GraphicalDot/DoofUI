define(function (require) {

    "use strict";

    var $ = require('jquery');
    var Handlebars = require('handlebars');
    var Marionette = require('marionette');
    var Template = require('text!./search.html');

    var SearchBox = Marionette.ItemView.extend({
        id: 'doof-search-view',
        template: Handlebars.compile(Template),
        onShow: function () {
            console.log(window.get_suggestions);
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
            });
        }
    });

    return SearchBox;
});