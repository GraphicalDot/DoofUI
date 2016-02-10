require.config({
	urlArgs: new Date().getTime(),
	waitSeconds: 0,
	paths: {
		//require js
		'text': '../../node_modules/text/text',

		//backbone
		'jquery': '../../node_modules/jquery/dist/jquery.min',
		'underscore': '../../node_modules/underscore/underscore-min',
		'backbone': '../../node_modules/backbone/backbone-min',
		'marionette': '../../node_modules/backbone.marionette/lib/backbone.marionette.min',
		'handlebars': '../../node_modules/handlebars/dist/handlebars.min',

		//materialize
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
	},
	shim: {
		'jquery': { exports: '$' },
		'underscore': { exports: '_' },
		'backbone': { deps: ['jquery', 'underscore'], exports: 'Backbone' },
		'marionette': { deps: ['backbone'], exports: 'Marionette' },
		'handlebars': { exports: 'Handlebars' },

		'animation': { deps: ['jquery'] },
		'buttons': { deps: ['jquery'] },
		'cards': { deps: ['jquery'] },
		'carousel': { deps: ['jquery'] },
		'character_counter': { deps: ['jquery'] },
		'chips': { deps: ['jquery'] },
		'collapsible': { deps: ['jquery'] },
		'dropdown': { deps: ['jquery'] },
		'forms': { deps: ['jquery', 'global'] },
		'global': { deps: ['jquery'] },
		'hammerjs': { exports: 'Hammer' },
		'jquery.easing': { deps: ['jquery'] },
		'jquery.hammer': { deps: ['jquery', 'hammerjs', 'waves'] },
		'jquery.timeago': { deps: ['jquery'] },
		'leanModal': { deps: ['jquery'] },
		'materialbox': { deps: ['jquery'] },
		'parallax': { deps: ['jquery'] },
		'pushpin': { deps: ['jquery'] },
		'scrollspy': { deps: ['jquery'] },
		'scrollFire': { deps: ['jquery', 'global'] },
		'sideNav': { deps: ['jquery'] },
		'slider': { deps: ['jquery'] },
		'tabs': { deps: ['jquery'] },
		'toasts': { deps: ['hammerjs', 'velocity'] },
		'tooltip': { deps: ['jquery'] },
		'transitions': { deps: ['jquery', 'scrollFire'] },
		'waves': { exports: 'Waves' },
		'velocity': { deps: ['jquery'], exports: 'Vel' },
	}
});

require(['jquery', 'jquery.easing', 'animation', 'velocity', 'hammerjs', 'jquery.hammer', 'global', 'collapsible', 'dropdown', 'leanModal', 'materialbox', 'parallax', 'tabs', 'tooltip', 'waves', 'toasts', 'sideNav', 'scrollspy', 'forms', 'slider', 'cards', 'pushpin', 'buttons', 'scrollFire', 'transitions', 'picker', 'picker.date', 'character_counter', 'chips', 'jquery.timeago'], function ($) {

	require(['./app'], function(App) {
		App.start();
	});
});