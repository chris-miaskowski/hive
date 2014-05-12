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

require(["Board", "ArrayMod", 'kineticjs', 'jquery', 'Player', 'Gui'], 
function(Board, ArrayMod, Kinetic, $, Player, Gui) {	

	var playerA = new Player('Player A', '#D6C0B9'),
		playerB = new Player('Player B', '#36302E'),
		players = [ playerA, playerB ];

	var stage = new Kinetic.Stage({
		container: 'boardContainer',
		width: 800,
		height: 800
	});		

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