requirejs.config({
	baseUrl: 'app/js',
	paths: {
		'kineticjs': '../bower_components/kineticjs/kinetic.min.js'
	},
	shim: {
		'kineticjs': {
			exports: 'Kinetic'
		}
	}
});