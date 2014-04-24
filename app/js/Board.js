define(['kineticjs', 'FieldModel'], function(Kinetic, FieldModel) {

	function Board(game) {
		this._game = game;

		this._stage = new Kinetic.Stage({
			container: 'boardContainer',
			width: 800,
			height: 800
		});

		this._layer = new Kinetic.Layer();

		this._stage.add(this._layer);

		this._structure = [];
	}	

	Board.prototype._game = null;

	Board.prototype._stage = null;

	Board.prototype._layer = null;

	Board.prototype._structure = null;

	Board.prototype._draggedHexagon = null;

	Board.prototype.init = function() {
		this._createField(
			this._createEmptyHexagon(
				this._stage.getWidth()/2, 
				this._stage.getHeight()/2), 
			new FieldModel()
		);
		this._layer.draw();
	}

	Board.prototype._createEmptyHexagon = function(x, y) {
		return new Kinetic.RegularPolygon({
	        x: x,
	        y: y,
	        sides: 6,
	        fill: 'white',
	        radius: 40,
	        stroke: 'black',
	        strokeWidth: 1,
	        dash: [8, 5],
	      });
	}

	Board.prototype._createHexagonNextTo = function(hexagon, factX, factY) {
		var R = hexagon.getRadius();
		var sqrt3 = Math.sqrt(3);
		return this._createEmptyHexagon(
			hexagon.getX() + factX*R*sqrt3/2,
			hexagon.getY() + factY*R*3/2
		);
	}

	Board.prototype._createHexagonNextToForIndex = function(hexagon, index) {
		// Some math magic
		function yFactor(i) {
			return (Math.floor(3/(i+1)) >= 1)*(1 - i) + (Math.floor((i+1)/4) >= 1)*(i - 4);
		}

		function xFactor(i) {
			var a = Math.pow(2, (i%3)%2);
			var b = -2*Math.floor((i+1)/4) + 1;
			return a*b;
		}

		return this._createHexagonNextTo(hexagon, xFactor(index), yFactor(index));
	}

	Board.prototype._getFieldByView = function(view) {
		return this._structure.filter(function(field) {
			return field.view == view;
		})[0];
	}

	Board.prototype._getFieldByModel = function(model) {
		return this._structure.filter(function(field) {
			return field.model == model;
		})[0];
	}

	Board.prototype._getFieldsByModels = function(models) {
		return models.map(this._getFieldByModel.bind(this));
	}

	Board.prototype._createField = function(hexagon, fieldModel) {
		console.log('creating new field');
		var field = {
			model: fieldModel,
			view: hexagon
		};		
		field.x = hexagon.getX();
		field.y = hexagon.getY();
		this._attachHandlers(field);
		this._structure.push(field);
		this._layer.add(hexagon);
		return field;
	}

	Board.prototype._attachHandlers = function(field) {
		var hexagon = field.view;
		hexagon.on('click', this._handleHexagonClicked.bind(this, field));
		hexagon.on('dragstart', this._handleHexagonDragStart.bind(this, field));
		hexagon.on('dragend', this._handleHexagonDragEnd.bind(this, field));
	}

	Board.prototype._boardContainsFieldModel = function(fieldModel) {
		return this._structure.filter(function(field) {
			return field.model == fieldModel;
		}).length > 0;
	}	

	Board.prototype._handleHexagonDragStart = function(field) {		
		var emptyHexagon = this._createEmptyHexagon(field.x, field.y),
			removedFields = this._getFieldsByModels(field.model.takePawnOff());

		this._draggedHexagon = field.view;		
		field.view = emptyHexagon;		
		this._attachHandlers(field);

		removedFields.forEach(function(rfield) {
			rfield.view.remove();
		});		

		this._layer.add(emptyHexagon);
		this._layer.draw();
		this._draggedHexagon.moveToTop();
	}

	Board.prototype._handleHexagonDragEnd = function(field, mouseEvent) {		
		this._draggedHexagon.remove();		
		this._draggedHexagon = null;
		this._layer.draw();

		var dropTarget = this._getFieldByView(
			this._stage.getIntersection(this._stage.pointerPos)
		);
		if(dropTarget) {
			this._handleHexagonClicked(dropTarget);			
		} else {
			this._handleHexagonClicked(field)
		}		
		this._layer.draw();		
	}

	Board.prototype._handleHexagonClicked = function(field) {	
		var hexagon = field.view,
			model = field.model,
			neighbour,
			newField,
			currentPlayer = this._game.currentPlayer;

		if(!model.pawn) {

			model.placePawn(currentPlayer.pawn);
			hexagon.fill(currentPlayer.color);
			hexagon.draggable(true);
			hexagon.dash([]);	
			console.log("placing pawn");

			for(var i = 0; i < model.neighbours.length; i++) {
				neighbour = model.neighbours[i];
				if(!this._boardContainsFieldModel(neighbour)) {					
					newField = this._createField(
						this._createHexagonNextToForIndex(hexagon, i),
						neighbour
					);					
				}
			}
			this._game.changeTurn();
		}				
		
		this._layer.draw();
	}		

	return Board;
});