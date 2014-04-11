requirejs.config({
	baseUrl: 'app/js',
	paths: {
		'kineticjs': '../../bower_components/kineticjs/kinetic.min'
	},
	shim: {
		'kineticjs': {
			exports: 'Kinetic'
		}
	}
});

require(["Board"], function(Board) {	

	new Board().init();

});