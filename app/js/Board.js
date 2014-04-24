define(['kineticjs', 'FieldModel', 'FieldView'], function(Kinetic, FieldModel, FieldView) {

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
		this._createField(			
			new FieldView(this._stage.getWidth()/2, this._stage.getHeight()/2, this, new FieldModel())
		);
		this._layer.draw();
	}

	Board.prototype._createField = function(fieldView) {
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

	Board.prototype._getFieldByHexagon = function(hex) {
		return this._fields.filter(function(field) {
			return field._hexagon == hex;
		})[0];
	}

	Board.prototype._getFieldByModel = function(model) {
		return this._fields.filter(function(field) {
			return field.model == model;
		})[0];
	}

	Board.prototype._getFieldsByModels = function(models) {
		return models.map(this._getFieldByModel.bind(this));
	}

	Board.prototype._boardContainsFieldModel = function(fieldModel) {
		return this._fields.filter(function(field) {
			return field.model == fieldModel;
		}).length > 0;
	}	

	Board.prototype.draggingStart = function(field) {		
		var removedFields = this._getFieldsByModels(field.model.takePawnOff());

		this._draggedField = field;
		this._fields.remove(field);
		this._createField(new FieldView(field.x, field.y, this, field.model));

		removedFields.forEach(function(rfield) {
			rfield.remove();
		});		
		
		this._draggedField.moveToTop();
		this._layer.draw();		
	}

	Board.prototype.draggingEnd = function(field, mouseEvent) {
		var draggedFieldReferer = this._getFieldByModel(this._draggedField.model);
		this._draggedField.remove();
		this._draggedField = null;
		this._layer.draw();

		var dropTarget = this._getFieldByHexagon(
			this._stage.getIntersection(this._stage.pointerPos)
		);
		if(dropTarget) {
			this.putPawnOn(dropTarget);			
		} else {
			this.putPawnOn(draggedFieldReferer);
		}		
		this._layer.draw();		
	}

	Board.prototype.putPawnOn = function(field) {	
		var model = field.model,
			neighbour,
			newField,
			currentPlayer = this._game.currentPlayer;

		if(!model.pawn) {

			model.placePawn(currentPlayer.pawn);
			field.placePawn(currentPlayer.pawn);
			console.log("placing pawn");

			for(var i = 0; i < model.neighbours.length; i++) {
				neighbour = model.neighbours[i];				
				if(!this._boardContainsFieldModel(neighbour)) {					
					var pos = this._emptyFieldInNeighbourhood(field, i);
					newField = this._createField(
						new FieldView(pos[0], pos[1], this, neighbour)
					);					
				}
			}
			this._game.changeTurn();
		}				
		
		this._layer.draw();
	}		

	return Board;
});