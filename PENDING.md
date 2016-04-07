REquire JS Config

// require(['jquery', 'jquery.easing', 'animation', 'velocity', 'hammerjs', 'jquery.hammer', 'global', 'collapsible', 'dropdown', 'leanModal', 'materialbox', 'parallax', 'tabs', 'tooltip', 'waves', 'toasts', 'sideNav', 'scrollspy', 'forms', 'slider', 'cards', 'pushpin', 'buttons', 'scrollFire', 'transitions', 'picker', 'picker.date', 'character_counter', 'chips', 'jquery.timeago', 'carousel'], function ($) {

// 	require(['./helpers', './doof'], function (Helpers, Doof) {
// 		Doof.start();
// 	});
// });


DOOF JS.
1. var key= new GetKeyModel(); key.fetch({data: { secret: "967d2b1f6111a198431532149879983a1ad3501224fb0dbf947499b1" }, type: 'POST'});
2. var apis = new ApisModel(); var pkey = apis.get('privateKey'); apis.fetch({ data: { "key": pkey }, type: 'POST' });