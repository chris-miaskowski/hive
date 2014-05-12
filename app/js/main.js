requirejs.config({
	baseUrl: 'app/js',
	paths: {
		'kineticjs': '../../bower_components/kineticjs/kinetic.min',
		'underscore': '../../bower_components/underscore/underscore',
		'jquery': '../../bower_components/jquery/dist/jquery'
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

require(["Board", "ArrayMod", 'kineticjs', 'jquery'], function(Board, ArrayMod, Kinetic, $) {	

	var playerA = { color: 'green', name: 'player a' },
		playerB = { color: 'red', name: 'player b' },			
		players = [ playerA, playerB ];

	playerA.pawn = { owner: playerA, type: 'Ant' };
	playerB.pawn = { owner: playerB, type: 'Ant' };

	var stage = new Kinetic.Stage({
		container: 'boardContainer',
		width: 800,
		height: 800
	});

	
	function Gui(game, stage) {
		this._game = game;
		this._currentPlayerText = $('.playerName');
		this.update();
		this.initialiseEvents();
	};	

	Gui.prototype.update = function() {
		this._currentPlayerText.html(this._game.currentPlayer.name);		
	};

	Gui.prototype.initialiseEvents = function() {
		jQuery('#pawnsSelect').on('change', function(jEvent) {
			var selectedPawn = $(jEvent.target).val();
			this._game.currentPlayer.pawn.type = selectedPawn;
		}.bind(this));
	};

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

	var board = new Board(game, stage);

	board.init();

});