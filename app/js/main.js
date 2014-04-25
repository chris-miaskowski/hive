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

require(["Board", "ArrayMod", 'kineticjs'], function(Board, ArrayMod, Kinetic) {	

	var playerA = { color: 'green', name: 'player a' },
		playerB = { color: 'red', name: 'player b' },			
		players = [playerA, playerB];

	playerA.pawn = { owner: playerA, type: 'A' };
	playerB.pawn = { owner: playerB, type: 'A' };

	var stage = new Kinetic.Stage({
		container: 'boardContainer',
		width: 800,
		height: 800
	});

	
	function Gui(game, stage) {
		this._currentPlayerText = renderText(0, 0, 
			'Current player: ', 'white');
		this._game = game;
		this._layer = new Kinetic.Layer();
		this._layer.add(this._currentPlayerText);
		stage.add(this._layer);
		this.update();
	}	

	Gui.prototype.update = function() {
		this._currentPlayerText.text(this._game.currentPlayer.name);
		this._currentPlayerText.fill(this._game.currentPlayer.color);
		this._layer.draw();
	}

	var game = {
		currentPlayer: players[0],
		changeTurn: function() {			
			game.currentPlayer = players[(players.indexOf(game.currentPlayer)+1)%2];
			this._gui.update();
		},
		setGui: function(gui) {
			this._gui = gui;
		}
	};	

	var gui = new Gui(game, stage);
	game.setGui(gui);
	game.changeTurn();

	var board = new Board(game, stage);

	board.init();

});