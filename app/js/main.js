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