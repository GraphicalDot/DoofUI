require.config({
	urlArgs: "food=" + (new Date()).getTime(),
	waitSeconds: 0,
	paths: {
		'jquery': '../../node_modules/jquery/dist/jquery',
		'jquery.actual': '../../node_modules/jquery.actual',
		'underscore': '../../node_modules/underscore/underscore',
		'backbone': '../../node_modules/backbone/backbone',
		'marionette': '../../node_modules/backbone.marionette/lib/backbone.marionette',
		'handlebars': '../../node_modules/handlebars/dist/handlebars',

		'radio': '../../node_modules/backbone.radio/build/backbone.radio',

		'text': '../../node_modules/text/text',

		'picker': '../../node_modules/materialize-css/js/date_picker/picker',
		'picker.date': '../../node_modules/materialize-css/js/date_picker/picker.date',
		'animation': '../../node_modules/materialize-css/js/animation',
		'buttons': '../../node_modules/materialize-css/js/buttons',
		'cards': '../../node_modules/materialize-css/js/cards',
		'carousel': '../../node_modules/materialize-css/js/carousel',
		'character_counter': '../../node_modules/materialize-css/js/character_counter',
		'chips': '../../node_modules/materialize-css/js/chips',
		'collapsible': '../../node_modules/materialize-css/js/collapsible',
		'dropdown': '../../node_modules/materialize-css/js/dropdown',
		'forms': '../../node_modules/materialize-css/js/forms',
		'global': '../../node_modules/materialize-css/js/global',
		'hammerjs': '../../node_modules/materialize-css/js/hammer.min',
		'jquery.easing': '../../node_modules/materialize-css/js/jquery.easing.1.3',
		'jquery.hammer': '../../node_modules/materialize-css/js/jquery.hammer',
		'jquery.timeago': '../../node_modules/materialize-css/js/jquery.timeago.min',
		'leanModal': '../../node_modules/materialize-css/js/leanModal',
		'materialbox': '../../node_modules/materialize-css/js/materialbox',
		'parallax': '../../node_modules/materialize-css/js/parallax',
		'prism': '../../node_modules/materialize-css/js/prism',
		'pushpin': '../../node_modules/materialize-css/js/pushpin',
		'scrollFire': '../../node_modules/materialize-css/js/scrollFire',
		'scrollspy': '../../node_modules/materialize-css/js/scrollspy',
		'sideNav': '../../node_modules/materialize-css/js/sideNav',
		'slider': '../../node_modules/materialize-css/js/slider',
		'tabs': '../../node_modules/materialize-css/js/tabs',
		'toasts': '../../node_modules/materialize-css/js/toasts',
		'tooltip': '../../node_modules/materialize-css/js/tooltip',
		'transitions': '../../node_modules/materialize-css/js/transitions',
		'velocity': '../../node_modules/materialize-css/js/velocity.min',
		'waves': '../../node_modules/materialize-css/js/waves',

		'd3': '../../node_modules/d3/d3',
		'nvd3': '../../node_modules/nvd3/build/nv.d3',

		'oms': '../../node_modules/marker-spider/dist/oms.min',

		'facebook': '//connect.facebook.net/en_US/sdk',

		'typeahead': '../../node_modules/typeahead.bundle',

		'es6promise': '../../node_modules/es6-promise/dist/es6-promise',

		'google-map-loader': '../../node_modules/google-map-loader',

		'bricks': '../../node_modules/bricks',
		'masonry': '../../node_modules/masonry.pkgd.min',
	},
	shim: {
		'jquery': { exports: '$' },
		'jquery.actual': {deps: ['jquery']},
		'underscore': { exports: '_' },
		'backbone': { deps: ['jquery', 'underscore'], exports: 'Backbone' },
		'marionette': { deps: ['backbone'], exports: 'Marionette' },
		'handlebars': { exports: 'Handlebars' },

		'radio': {
			deps: ['marionette'],
			exports: 'Radio'
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

		'oms': {
			exports: 'OverlappingMarkerSpiderfier'
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



require(['jquery', 'jquery.easing', 'animation', 'velocity', 'hammerjs', 'jquery.hammer', 'global', 'collapsible', 'dropdown', 'leanModal', 'materialbox', 'parallax', 'tabs', 'tooltip', 'waves', 'toasts', 'sideNav', 'scrollspy', 'forms', 'slider', 'cards', 'pushpin', 'buttons', 'scrollFire', 'transitions', 'picker', 'picker.date', 'character_counter', 'chips', 'jquery.timeago', 'carousel'], function ($) {

	require(['./helpers', './doof'], function (Helpers, Doof) {
		Doof.start();
	});
});