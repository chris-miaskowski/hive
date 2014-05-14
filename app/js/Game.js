define(["Board", "ArrayMod", 'kineticjs', 'jquery', 'Player', 'Gui', 'ResourceLoader'], 
function(Board, ArrayMod, Kinetic, $, Player, Gui, ResourceLoader) {

	var playerA = new Player('Player A', '#D6C0B9'),
		playerB = new Player('Player B', '#36302E'),
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

		var resourceLoader = new ResourceLoader();
		resourceLoader.loadResources().then(function(library) {
			
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