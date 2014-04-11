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

	FieldModel.prototype.takePawnOff = function() {
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

	FieldModel.prototype.hasOnlyEmptyNeighbours = function() {
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

	return FieldModel;

});