define(['VectorNet'], function(VectorNet) {		

	var vectorNet;

	function FieldModel() {
		this.neighbours = new Array(6);
		// net is empty, create root node
		if(!vectorNet) {
			vectorNet = new VectorNet(this);			
		}
	}

	FieldModel.prototype.pawn = null;

	FieldModel.prototype.neighbours = null;

	FieldModel.prototype.placePawn = function(pawn) {
		var neighbours = this.neighbours,
			neighboursNumber = neighbours.length,
			neighbour,
			masterIndex,
			prevSiblingIndex,
			nextSiblingIndex,
			i;

		this.pawn = pawn;		

		for(i = 0; i < neighboursNumber; i++) {
			if(neighbours[i]) continue;
			neighbour = new FieldModel();
			vectorNet.addFieldNextTo(neighbour, this, i);				
			neighbours[i] = neighbour;
			// set pointer to 'parent'
			neighbour.neighbours[mirrorIndex(i)] = this;
		}

		neighbours.forEach(makeConnections);
	};	

	FieldModel.prototype.takePawnOff = function() {
		var neighbour,
			neighbours = this.neighbours,
			removed = [];

		function clearReferencesToField(field) {
			var neighbours = field.neighbours,
				neighbour;

			// loop through removed field neighbours and clear references
			for(var i = 0; i < neighbours.length; i++) {
				neighbour = neighbours[i];
				if(neighbour) {
					delete neighbour.neighbours[mirrorIndex(i)];
				}
			}
		}

		this.pawn = null;
		
		for(var i = 0; i < neighbours.length; i++) {
			neighbour = neighbours[i];			

			// only those neighbours that are empty and have only empty neighbours
			if(neighbour && !neighbour.pawn && neighbour.hasOnlyEmptyNeighbours()) {
				vectorNet.removeByField(neighbour);
				removed.push(neighbour);
				clearReferencesToField(neighbour);				
			}			
		}
		
		return removed;
	};

	FieldModel.prototype.hasOnlyEmptyNeighbours = function() {
		return this.neighbours.filter(function(n) { return n && n.pawn; }).length == 0;
	};

	function makeConnections(field) {
		var neighbours = field.neighbours,
			neighbour,
			node;

		for(var j = 0; j < neighbours.length; j++) {
			neighbour = neighbours[j];
			if(!neighbour) {
				node = vectorNet.findNodeNextTo(field, j);
				if(node) {
					neighbours[j] = node.field;
					node.field.neighbours[mirrorIndex(j)] = field;
				}
			}
		}

	}

	function mirrorIndex(index) {
		return (index + 3) % 6;
	}

	function nextIndex(index) {
		return (index + 1) % 6;
	}

	function prevIndex(index) {
		return (index + 5) % 6;
	}

	return FieldModel;

});