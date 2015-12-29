require.config({
	urlArgs: new Date().getTime(),
	waitSeconds: 0,
	paths: {
		'jquery': './../vendors/jquery/jquery-1.11.3.min',
		'underscore': './../vendors/marionette/underscore/underscore',
		'backbone': './../vendors/marionette/backbone-min',
		'backbone.marionette': './../vendors/marionette/backbone.marionette',
		'handlebars': './../vendors/handlebars-v4.0.2',

		'text': './../vendors/requirejs/plugins/text',
		'require-async': './../vendors/requirejs/plugins/require-async',
		'google-map-loader': './../vendors/google-map-loader',

		// Materialaze CSS dependencies
		'picker': './../vendors/materialize/js/date_picker/picker',
		'picker.date': './../vendors/materialize/js/date_picker/picker.date',
		'animation': './../vendors/materialize/js/animation',
		'buttons': './../vendors/materialize/js/buttons',
		'cards': './../vendors/materialize/js/cards',
		'character_counter': './../vendors/materialize/js/character_counter',
		'chips': './../vendors/materialize/js/chips',
		'collapsible': './../vendors/materialize/js/collapsible',
		'dropdown': './../vendors/materialize/js/dropdown',
		'forms': './../vendors/materialize/js/forms',
		'global': './../vendors/materialize/js/global',
		'hammerjs': './../vendors/materialize/js/hammer.min',
		'jquery.easing': './../vendors/materialize/js/jquery.easing.1.3',
		'jquery.hammer': './../vendors/materialize/js/jquery.hammer',
		'jquery.timeago': './../vendors/materialize/js/jquery.timeago.min',
		'leanModal': './../vendors/materialize/js/leanModal',
		'materialbox': './../vendors/materialize/js/materialbox',
		'parallax': './../vendors/materialize/js/parallax',
		'prism': './../vendors/materialize/js/prism',
		'pushpin': './../vendors/materialize/js/pushpin',
		'scrollFire': './../vendors/materialize/js/scrollFire',
		'scrollspy': './../vendors/materialize/js/scrollspy',
		'sideNav': './../vendors/materialize/js/sideNav',
		'slider': './../vendors/materialize/js/slider',
		'tabs': './../vendors/materialize/js/tabs',
		'toasts': './../vendors/materialize/js/toasts',
		'tooltip': './../vendors/materialize/js/tooltip',
		'transitions': './../vendors/materialize/js/transitions',
		'velocity': './../vendors/materialize/js/velocity.min',
		'waves': './../vendors/materialize/js/waves',

		'd3': './../vendors/d3/d3.min',
		'd3.tips': './../vendors/d3/d3.tips',
		'radialGraph': './../vendors/d3/radialGraph',
		'd3bubbleGraph': './../vendors/d3/d3.bubbleGraph',
		'nvd3': './../vendors/d3/nv.d3',

		'facebook': '//connect.facebook.net/en_US/sdk',
		'typeahead': './../vendors/typeahead/typeahead.bundle',
		'bloodhound': './../vendors/typeahead/bloodhound',
		'es6Promises': './../vendors/es6-promises',
		'async': './../vendors/async',
		'gmaps': './../vendors/gmaps'
	},
	shim: {
		'jquery': {
			exports: '$'
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'backbone.marionette': {
			deps: ['backbone'],
			exports: 'Marionette'
		},

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

		'facebook': {
			exports: 'FB'
		},

		'typeahead': {
			deps: ['jquery'],
			init: function ($) {
				return require.s.contexts._.registry['typeahead.js'].factory($);
			}
		},

		'bloodhound': {
			deps: ['jquery'],
        	exports: "Bloodhound"
		},

		'handlebars': {
			exports: 'Handlebars'
		},

		'd3.tips': {
			deps: ['d3']
		},

		'radialGraph': {
			deps: ['d3', 'd3.tips']
		},

		'd3bubbleGraph': {
			deps: ['d3']
		},

		'nvd3': {
			deps: ['d3']
		}
	}
});

require(['jquery.easing', 'animation', 'velocity', 'hammerjs', 'jquery.hammer', 'global', 'collapsible', 'dropdown', 'leanModal', 'materialbox', 'parallax', 'tabs', 'tooltip', 'waves', 'toasts', 'sideNav', 'scrollspy', 'forms', 'slider', 'cards', 'pushpin', 'buttons', 'scrollFire', 'transitions', 'picker', 'picker.date', 'character_counter', 'chips', 'jquery.timeago'], function () {

	require(['jquery', './app', './../global_variables', 'facebook'], function ($, App) {

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

		App.start({ el: '.doof' });
	});
});