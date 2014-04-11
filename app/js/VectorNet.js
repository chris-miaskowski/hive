define(function() {		

	function VectorNet(root) {
		this._vectorNet = [ createNode(root, [0, 0]) ];			
	}	

	VectorNet.prototype._vectorNet = null;

	VectorNet.prototype.addFieldNextTo = function(newField, parentField, direction) {
		var vector = this._getVectorForFieldAndDirection(parentField, direction);
		this._vectorNet.push(createNode(newField, vector));
	}

	VectorNet.prototype.findNodeNextTo = function(field, direction) {
		return this._findNodeByVector(this._getVectorForFieldAndDirection(field, direction));
	}

	VectorNet.prototype._getVectorForIndex = function(index) {
		if(index == 0) { return [1,1]; }
		if(index == 1) { return [2,0]; }
		if(index == 2) { return [1,-1]; }
		if(index == 3) { return [-1,-1]; }
		if(index == 4) { return [-2,0]; }
		if(index == 5) { return [-1,1]; }
	}

	VectorNet.prototype._findNodeByField = function(field) {
		return this._vectorNet.filter(function(node) {
			return node.field == field;
		})[0]
	}

	VectorNet.prototype._findNodeByVector = function(vector) {
		return this._vectorNet.filter(function(node) {
			return node.vector[0] == vector[0] && node.vector[1] == vector[1];
		})[0];
	}

	VectorNet.prototype._getVectorForFieldAndDirection = function(field, direction) {
		var node = this._findNodeByField(field);
		var indexVector = this._getVectorForIndex(direction);

		return [
			node.vector[0] + indexVector[0], 
			node.vector[1] + indexVector[1]
		];
	}

	function createNode(field, vector) {
		return {
			field: field,
			vector: vector
		}
	}

	return VectorNet;

});