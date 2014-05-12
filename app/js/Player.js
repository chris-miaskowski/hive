define(['Functional'], function(fn) {

	function Player(name, color) {
		this.name = name;
		this.color = color;		
		this.pawns = [
			{ type: "Ant", quantity: 3 },
			{ type: "Spider", quantity: 3 },
			{ type: "Beetle", quantity: 2 },
			{ type: "Grasshopper", quantity: 2 },
			{ type: "Bee", quantity: 1 }
		];

		this.pawns.forEach(function(pawn) {
			pawn.owner = this;
		}.bind(this));

		this.pawn = this.pawns[0];
	}

	Player.prototype.holdPawn = function(pawnType) {
		this.pawn = this.pawns.find(fn.dot('type').eq(pawnType));
	};

	Player.prototype.releasePawn = function() {
		var pawn = this.pawn;
		this.pawn.quantity--;
		if(pawn.quantity == 0) {
			this.pawn = this.pawns.find(fn.dot('quantity').gt(0));			
		}
		return pawn;
	};

	return Player;

});