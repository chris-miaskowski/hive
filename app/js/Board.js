define(['kineticjs', 'FieldModel', 'FieldView', 'Functional'], 
function(Kinetic, FieldModel, FieldView, fn) {

	function Board(game) {
		this._game = game;

		this._stage = new Kinetic.Stage({
			container: 'boardContainer',
			width: 800,
			height: 800,
			draggable: true
		});

		this._layer = new Kinetic.Layer();

		this._stage.add(this._layer);

		this._fields = [];
	}	

	Board.prototype._game = null;

	Board.prototype._stage = null;

	Board.prototype._layer = null;

	Board.prototype._fields = null;

	Board.prototype._draggedField = null;

	Board.prototype.init = function() {
		this._addField(			
			new FieldView(this._stage.getWidth()/2, 
				this._stage.getHeight()/2, this, new FieldModel())
		);
		this._layer.draw();
	}

	Board.prototype._addField = function(fieldView) {
		console.log('creating new field');	
		this._fields.push(fieldView);
		fieldView.addToLayer(this._layer);
		return fieldView;
	}

	Board.prototype._coordsWithOffset = function(fieldView, factX, factY) {
		var R = 40;
		var sqrt3 = Math.sqrt(3);
		return [
			fieldView.x + factX*R*sqrt3/2,
			fieldView.y + factY*R*3/2
		];
	}

	Board.prototype._emptyFieldInNeighbourhood = function(fieldView, index) {
		// Some math magic
		function yFactor(i) {
			return (Math.floor(3/(i+1)) >= 1)*(1 - i) + (Math.floor((i+1)/4) >= 1)*(i - 4);
		}

		function xFactor(i) {
			var a = Math.pow(2, (i%3)%2);
			var b = -2*Math.floor((i+1)/4) + 1;
			return a*b;
		}

		return this._coordsWithOffset(fieldView, xFactor(index), yFactor(index));
	}

	Board.prototype._getFieldByModel = function(model) {
		return this._fields.find(fn.dot('model').eq(model));
	}

	Board.prototype.draggingStart = function(field) {		
		var removedFields = field.model.takePawnOff()
				.map(this._getFieldByModel.bind(this));

		this._draggedField = field;
		// remove dragged field from the boards but leave it on screen
		this._fields.remove(field);
		// add new, empty, field in place of the dragged one
		this._addField(new FieldView(field.x, field.y, this, field.model));

		// remove all unnecessary fields left after taking pawn off
		removedFields.forEach(function(rfield) {
			rfield.remove();
			this._fields.remove(rfield);
		}.bind(this));		
		
		this._draggedField.moveToTop();
		this._layer.draw();		
	}

	Board.prototype.draggingEnd = function(field) {
		var originalField = this._getFieldByModel(this._draggedField.model),
			hexagon,
			dropTargetField;

		// remove dragged field from screen
		this._draggedField.remove();
		this._draggedField = null;
		this._layer.draw();

		hexagon = this._stage.getIntersection(this._stage.pointerPos);
		dropTargetField = this._fields.find(fn.dot('_hexagon').eq(hexagon));
		
		if(dropTargetField) {
			this.putPawnOn(dropTargetField);			
		} else {
			this.putPawnOn(originalField);
		}		

		this._layer.draw();		
	}

	Board.prototype.putPawnOn = function(field) {	
		var model = field.model,
			currentPlayer = this._game.currentPlayer,
			pos;

		if(!model.pawn) {

			model.placePawn(currentPlayer.pawn);
			field.update();

			_.each(model.neighbours, function(neighbour, index) {
				if(!this._getFieldByModel(neighbour)) {					
					pos = this._emptyFieldInNeighbourhood(field, index);
					this._addField(new FieldView(pos[0], pos[1], this, neighbour));					
				}
			}.bind(this));

			this._game.changeTurn();
		}				
		
		this._layer.draw();
	}		

	return Board;
});