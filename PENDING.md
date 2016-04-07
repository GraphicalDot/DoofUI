REquire JS Config

// require(['jquery', 'jquery.easing', 'animation', 'velocity', 'hammerjs', 'jquery.hammer', 'global', 'collapsible', 'dropdown', 'leanModal', 'materialbox', 'parallax', 'tabs', 'tooltip', 'waves', 'toasts', 'sideNav', 'scrollspy', 'forms', 'slider', 'cards', 'pushpin', 'buttons', 'scrollFire', 'transitions', 'picker', 'picker.date', 'character_counter', 'chips', 'jquery.timeago', 'carousel'], function ($) {

// 	require(['./helpers', './doof'], function (Helpers, Doof) {
// 		Doof.start();
// 	});
// });


DOOF JS.
1. var key= new GetKeyModel(); key.fetch({data: { secret: "967d2b1f6111a198431532149879983a1ad3501224fb0dbf947499b1" }, type: 'POST'});
2. var apis = new ApisModel(); var pkey = apis.get('privateKey'); apis.fetch({ data: { "key": pkey }, type: 'POST' });


ROUTER JS :-
Way to pass collection from landing Page to application Page because we have already list of restaurants when we are shifting from landingPage to applicationPage.


LANDING PAGE.JS :-
self.location.accuracy= position.coords.accuracy;

LANDING PAGE.html :-
<div class="landing-content__enter_application">
		<div class="landingPage-content__locationBox-wrapper">
			<label for="landingPage-locationBox"><i class="material-icons">place</i></label>
			<input type="text" id="landingPage-locationBox" name="landingPage-locationBox" class="search-box" placeholder="Enter your location"
			value="{{startingAddress}}">
		</div>
		<div class="landingPage-content__enterApplication-wrapper">
			<div class="landingPage-content__enter-btn"><a href="#/application" id="landingPage-enter-btn" class="btn waves-effect waves-light">Enter Application</a></div>
			<input type="radio" name="enter_as" id="guest">
			<label for="guest">Enter as Guest</label>
			{{#if isUserAuthorized}}
			<input type="radio" name="enter_as" id="facebook" class="is_logged">
			<label for="facebook">
				Enter as {{getUsername}}
			</label>
			{{else}}
			<input type="radio" name="enter_as" id="facebook" class="is_not_logged">
			<label for="facebook">
				Enter using Facebook Account
			</label>
			{{/if}}
		</div>
	</div>
	<!--<div class="landingPage-content__madmachines">
        <p>Created by</p>
        <a href="http://www.madmachines.io" target="_blank">Mad Machines</a>
    </div>-->

