/* global requirejs */
requirejs.config({
    urlArgs: new Date().getTime(),
    waitSeconds: 0,
    paths: {
        'jquery': './../libraries/jquery.min',
        'underscore': './../libraries/underscore-min',
        'backbone': './../libraries/backbone-min',
        'marionette': './../libraries/backbone.marionette.min',
        'handlebars': './../libraries/handlebars-v4.0.5',

        'text': './../libraries/require-text',
        'r-async': './../libraries/require-async',

        'picker': './../libraries/materialize/js/date_picker/picker',
        'picker.date': './../libraries/materialize/js/date_picker/picker.date',
        'animation': './../libraries/materialize/js/animation',
        'buttons': './../libraries/materialize/js/buttons',
        'cards': './../libraries/materialize/js/cards',
        'carousel': './../libraries/materialize/js/carousel',
        'character_counter': './../libraries/materialize/js/character_counter',
        'chips': './../libraries/materialize/js/chips',
        'collapsible': './../libraries/materialize/js/collapsible',
        'dropdown': './../libraries/materialize/js/dropdown',
        'forms': './../libraries/materialize/js/forms',
        'global': './../libraries/materialize/js/global',
        'hammerjs': './../libraries/materialize/js/hammer.min',
        'jquery.easing': './../libraries/materialize/js/jquery.easing.1.3',
        'jquery.hammer': './../libraries/materialize/js/jquery.hammer',
        'jquery.timeago': './../libraries/materialize/js/jquery.timeago.min',
        'leanModal': './../libraries/materialize/js/leanModal',
        'materialbox': './../libraries/materialize/js/materialbox',
        'parallax': './../libraries/materialize/js/parallax',
        'prism': './../libraries/materialize/js/prism',
        'pushpin': './../libraries/materialize/js/pushpin',
        'scrollFire': './../libraries/materialize/js/scrollFire',
        'scrollspy': './../libraries/materialize/js/scrollspy',
        'sideNav': './../libraries/materialize/js/sideNav',
        'slider': './../libraries/materialize/js/slider',
        'tabs': './../libraries/materialize/js/tabs',
        'toasts': './../libraries/materialize/js/toasts',
        'tooltip': './../libraries/materialize/js/tooltip',
        'transitions': './../libraries/materialize/js/transitions',
        'velocity': './../libraries/materialize/js/velocity.min',
        'waves': './../libraries/materialize/js/waves',

        'd3': './../libraries/d3.v3.min',
		'nvd3': './../libraries/nvd3',

        'facebook': '//connect.facebook.net/en_US/sdk',

        'typeahead': './../libraries/typeahead.bundle',

        'es6promise': './../libraries/es6promises'
    },
    shim: {
        'jquery': { exports: '$' },
        'underscore': { exports: '_' },
        'backbone': { deps: ['jquery', 'underscore'], exports: 'Backbone' },
        'marionette': { deps: ['backbone'], exports: 'Marionette' },
        'handlebars': { exports: 'Handlebars' },

        'velocity': {
            deps: ['jquery'],
            exports: 'Vel'
        },

        'jquery.easing': {
            deps: ['jquery']
        },

        'animation': {
            deps: ['jquery']
        },

        'hammerjs': {
            exports: 'Hammer'
        },

        'jquery.hammer': {
            deps: ['jquery', 'hammerjs', 'waves']
        },

        'global': {
            deps: ['jquery']
        },

        'toasts': {
            deps: ['hammerjs', 'velocity']
        },

        'carousel': {
            deps: ['jquery']
        },

        'collapsible': {
            deps: ['jquery']
        },

        'dropdown': {
            deps: ['jquery']
        },

        'leanModal': {
            deps: ['jquery']
        },

        'materialbox': {
            deps: ['jquery']
        },

        'parallax': {
            deps: ['jquery']
        },

        'tabs': {
            deps: ['jquery']
        },

        'tooltip': {
            deps: ['jquery']
        },

        'sideNav': {
            deps: ['jquery']
        },

        'scrollspy': {
            deps: ['jquery']
        },

        'forms': {
            deps: ['jquery', 'global']
        },

        'slider': {
            deps: ['jquery']
        },

        'cards': {
            deps: ['jquery']
        },

        'pushpin': {
            deps: ['jquery']
        },

        'buttons': {
            deps: ['jquery']
        },

        'transitions': {
            deps: ['jquery', 'scrollFire']
        },

        'scrollFire': {
            deps: ['jquery', 'global']
        },

        'waves': {
            exports: 'Waves'
        },

        'character_counter': {
            deps: ['jquery']
        },

        'chips': {
            deps: ['jquery']
        },

        'jquery.timeago': {
            deps: ['jquery']
        },

		'nvd3': {
			deps: ['d3']
		},

        'facebook': { exports: 'FB' },
        'typeahead': {
            deps: ['jquery'],
            init: function ($) {
                return require.s.contexts._.registry['typeahead.js'].factory($);
            }
        },
    }
});

require(['jquery', 'jquery.easing', 'animation', 'velocity', 'hammerjs', 'jquery.hammer', 'global', 'collapsible', 'dropdown', 'leanModal', 'materialbox', 'parallax', 'tabs', 'tooltip', 'waves', 'toasts', 'sideNav', 'scrollspy', 'forms', 'slider', 'cards', 'pushpin', 'buttons', 'scrollFire', 'transitions', 'picker', 'picker.date', 'character_counter', 'chips', 'jquery.timeago'], function ($) {

	$.fn.enterKey = function (fnc) {
		return this.each(function () {
			$(this).keypress(function (ev) {
				var keycode = (ev.keyCode ? ev.keyCode : ev.which);
				if (keycode == '13') {
					fnc.call(this, ev);
				}
			});
		});
	}

    //  fetch api end points here
    window.get_trending = "http://52.76.176.188:8000/gettrending";
    window.get_suggestions = "http://52.76.176.188:8000/suggestions";
	window.textsearch = "http://52.76.176.188:8000/textsearch";

    require(['./doof'], function (Doof) {
        Doof.start();
    });
});