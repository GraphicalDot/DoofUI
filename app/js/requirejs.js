require.config({
	urlArgs: "food=" + (new Date()).getTime(),
	waitSeconds: 40,
	paths: {
		//requirejs plugins
		'text': '../../node_modules/text/text',

		//backbone
		'jquery': '../../node_modules/jquery/dist/jquery',
		'underscore': '../../node_modules/underscore/underscore',
		'backbone': '../../node_modules/backbone/backbone',
		'backbone.radio': './../../node_modules/backbone.radio/build/backbone.radio',
		'marionette': '../../node_modules/backbone.marionette/lib/backbone.marionette',
		'marionette-service': './../../node_modules/marionette-service/dist/marionette-service',
		'handlebars': '../../node_modules/handlebars/dist/handlebars',

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

		//facebook sdk
		'facebook': '//connect.facebook.net/en_US/sdk',

		//d3 library
		'd3': '../../node_modules/d3/d3',
		'nvd3': '../../node_modules/nvd3/build/nv.d3',

		//google maps
		'google-map-loader': '../../node_modules/google-map-loader',
		'oms': '../../node_modules/marker-spider/dist/oms.min',

		//others
		'typeahead': '../../node_modules/typeahead.bundle',
		'es6promise': '../../node_modules/es6-promise/dist/es6-promise',
	},
	shim: {
		'jquery': { exports: '$' },
		'underscore': { exports: '_' },
		'backbone': { deps: ['jquery', 'underscore'], exports: 'Backbone' },
		'backbone.radio': { deps: ['backbone'], exports: 'Radio' },
		'marionette': { deps: ['backbone'], exports: 'Marionette' },
		'marionette-service': { deps: ['marionette', 'backbone.radio'], exports: 'Service' },
		'handlebars': { exports: 'Handlebars' },


		'velocity': { deps: ['jquery'], exports: 'Vel' },
		'jquery.easing': { deps: ['jquery'] },
		'animation': { deps: ['jquery'] },
		'hammerjs': { exports: 'Hammer' },
		'jquery.hammer': { deps: ['jquery', 'hammerjs', 'waves'] },
		'global': { deps: ['jquery'] },
		'toasts': { deps: ['hammerjs', 'velocity', 'global'] },
		'carousel': { deps: ['jquery'] },
		'collapsible': { deps: ['jquery'] },
		'dropdown': { deps: ['jquery', 'jquery.easing'] },
		'leanModal': { deps: ['jquery'] },
		'materialbox': { deps: ['jquery'] },
		'parallax': { deps: ['jquery'] },
		'tabs': { deps: ['jquery'] },
		'tooltip': { deps: ['jquery'] },
		'sideNav': { deps: ['jquery'] },
		'scrollspy': { deps: ['jquery'] },
		'forms': { deps: ['jquery', 'global'] },
		'slider': { deps: ['jquery'] },
		'cards': { deps: ['jquery'] },
		'pushpin': { deps: ['jquery'] },
		'buttons': { deps: ['jquery'] },
		'transitions': { deps: ['jquery', 'scrollFire'] },
		'scrollFire': { deps: ['jquery', 'global'] },
		'waves': { exports: 'Waves' },
		'character_counter': { deps: ['jquery'] },
		'chips': { deps: ['jquery'] },
		'jquery.timeago': { deps: ['jquery'] },

		'facebook': { exports: 'FB' },

		'nvd3': { deps: ['d3'] },

		'oms': { exports: 'OverlappingMarkerSpiderfier' },

		'typeahead': {
			deps: ['jquery'],
			init: function ($) {
				return require.s.contexts._.registry['typeahead.js'].factory($);
			}
		},
	}
});

require.onError = function (err) {
	console.log(err.requireModules);
	console.log(err.requireType);
	// if (err.requireType === 'timeout') {
	// 	$("body").trigger({ type: "moduleFail", err: err })
	// } else {
	// 	throw err;
	// }
}

require(['./doof']);