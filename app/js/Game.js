define(["Board", "ArrayMod", 'kineticjs', 'jquery', 'Player', 'Gui'], 
function(Board, ArrayMod, Kinetic, $, Player, Gui) {

	var playerA = new Player('Player A', '#eee'),
		playerB = new Player('Player B', '#555'),
		players = [ playerA, playerB ];

	function Game() {
		this.currentPlayer = players[0];
	}

	Game.prototype.start = function() {

		var stage = new Kinetic.Stage({
			container: 'boardContainer',
			width: 800,
			height: 800
		});

		var gui = new Gui(this, stage);
		this.setGui(gui);	

		var board = new Board(this, stage);

		board.init();
	};

	Game.prototype.changeTurn = function() {			
		this.currentPlayer = players[(players.indexOf(this.currentPlayer)+1)%2];
		this._gui.update();
	};

	Game.prototype.setGui = function(gui) {
		this._gui = gui;
	};

	return Game;

});