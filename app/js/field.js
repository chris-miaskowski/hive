define(function() {	

	function Field() {
		this.neighbours = new Array(6);
	}

	Field.prototype.pawn = null;

	Field.prototype.neighbours = null;

	Field.prototype.placePawn = function(pawn) {
		var neighbours = this.neighbours,
			neighboursNumber = neighbours.length,
			neighbourIndex,
			neighbour,
			masterIndex,
			prevSiblingIndex,
			nextSiblingIndex,
			i;

		this.pawn = pawn;

		for(i = 0; i < neighboursNumber; i++) {
			if(neighbours[i]) continue;
			neighbours[i] = new Field();
		}


		for(i = 0; i < neighboursNumber; i++) {
			neighbourIndex = neighbours[i];
			neighbour = neighbours[neighbourIndex];
			masterIndex = mirrorIndex(index);
			prevSiblingIndex = prevIndex(masterIndex);
			nextSiblingIndex = nextIndex(masterIndex);

			// set reverse master neighbour field
			neighbour.neighbours[ masterIndex ] = this;
			// set previous sibling, a bit of magic related to symmetrical nature of hexagon
			neighbour.neighbours[ prevSiblingIndex ] = this.neighbours[ mirrorIndex(nextSiblingIndex) ];
			// set next sibling
			neighbour.neighbours[ nextSiblingIndex ] = this.neighbours[ mirrorIndex(prevSiblingIndex) ];
		}
	};

	Field.prototype.takePawnOff = function() {
		this.pawn = null;
		
		this.neighbours
			.filter(function(n) { 
				// get only fields to remove - without pawn and with only empty neighbours
				return n && !n.pawn && n.hasOnlyEmptyNeighbours();
			})
			.forEach(function(n) {
				var i = this.neighbours.indexOf(n);
				n.neighbours = null;		
				delete this.neighbours[i];
			}.bind(this));
	};

	Field.prototype.hasOnlyEmptyNeighbours = function() {
		return this.neighbours.filter(function(n) { return n && n.pawn; }).length == 0;
	};

	function mirrorIndex(index) {
		return (index + 3) % 6;
	}

	function nextIndex(index) {
		return (index + 1) % 6;
	}

	function prevIndex(index) {
		return (index + 5) % 6;
	}

	return Field;

});