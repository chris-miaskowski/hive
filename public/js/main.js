requirejs.config({
	baseUrl: 'js',
	paths: {
		'kineticjs': '../../bower_components/kineticjs/kinetic.min',
		'underscore': '../../bower_components/underscore/underscore',
		'jquery': '../../bower_components/jquery/dist/jquery',
		'rsvp': '../../bower_components/rsvp/rsvp.amd'
	},
	shim: {
		'kineticjs': {
			exports: 'Kinetic'
		},
		'underscore': {
			exports: 'underscore'
		},
		'jquery': {
			exports: 'jquery'
		}
	}
});

require(['Game', 'ResourceLoader'], function(Game, ResourceLoader) {	
	new ResourceLoader().loadResources().then(function(resourceLibrary) {
		window.ResourceLibrary = resourceLibrary;
		new Game().start();
	});	
});