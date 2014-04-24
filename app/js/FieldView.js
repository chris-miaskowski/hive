define(['kineticjs'], function(Kinetic) {

	function emptyField(x, y) {
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

	var FieldView = function (x, y, board, model) {	
		this.model = model;
		this.x = x;
		this.y = y;
		this._board = board;
		this._hexagon = emptyField(x, y);		
		this._initialiseEvents();
	}

	FieldView.prototype._initialiseEvents = function() {
		var hexagon = this._hexagon;
		hexagon.on('click', this._handleHexagonClicked.bind(this));
		hexagon.on('dragstart', this._handleHexagonDragStart.bind(this));
		hexagon.on('dragend', this._handleHexagonDragEnd.bind(this));
	}

	FieldView.prototype._handleHexagonClicked = function() {	
		this._board.putPawnOn(this);
	}		

	FieldView.prototype._handleHexagonDragStart = function() {		
		this._board.draggingStart(this);		
	}

	FieldView.prototype._handleHexagonDragEnd = function(mouseEvent) {
		this._board.draggingEnd(this, mouseEvent);
	}

	FieldView.prototype.empty = function() {
		this._hexagon = emptyField(this.x, this.y);
		this._initialiseEvents();
	}

	FieldView.prototype.remove = function() {
		this._hexagon.remove();
	}

	FieldView.prototype.addToLayer = function(layer) {
		layer.add(this._hexagon);		
	}

	FieldView.prototype.placePawn = function(pawn) {
		var hexagon = this._hexagon;
		hexagon.fill(pawn.owner.color);
		hexagon.draggable(true);
		hexagon.dash([]);	

		var text = new Kinetic.Text({
	        x: this.x,
	        y: this.y,
	        text: pawn.type,
	        fontSize: 30,
	        fontFamily: 'Calibri',
	        fill: 'black'
	    });
	    this._board._layer.add(text);
	}

	FieldView.prototype.moveToTop = function() {
		this._hexagon.moveToTop();
	}

	return FieldView;

});