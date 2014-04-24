requirejs.config({
	baseUrl: 'app/js',
	paths: {
		'kineticjs': '../../bower_components/kineticjs/kinetic.min',
		'underscore': '../../bower_components/underscore/underscore'
	},
	shim: {
		'kineticjs': {
			exports: 'Kinetic'
		},
		'underscore': {
			exports: 'underscore'
		}
	}
});

require(["Board", "ArrayMod"], function(Board, ArrayMod) {	

	var playerA = { color: 'green' },
		playerB = { color: 'red' },			
		players = [playerA, playerB];

	playerA.pawn = { owner: playerA, type: 'A' };
	playerB.pawn = { owner: playerB, type: 'A' };

	var game = {
		currentPlayer: players[0],
		changeTurn: function() {			
			game.currentPlayer = players[(players.indexOf(game.currentPlayer)+1)%2];
		}
	};

	var board = new Board(game);

	board.init();

});