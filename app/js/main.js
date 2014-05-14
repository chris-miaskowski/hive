requirejs.config({
	baseUrl: 'app/js',
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

function renderText(x, y, text, color) {
	return new Kinetic.Text({
        x: x,
        y: y,
        text: text,
        fontSize: 24,
        fontFamily: 'Calibri',
        fill: color
    });
}

require(['Game'], function(Game) {	
	new Game().start();
});