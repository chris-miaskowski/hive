define(['kineticjs', 'Subscribable'], function(Kinetic, Subscribable) {

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
		Subscribable.prototype.constructor.call(this);
		this.model = model;
		this.x = x;
		this.y = y;
		this._board = board;
		this._hexagon = emptyField(x, y);	
		this._group = new Kinetic.Group({}); 	
	    this._group.add(this._hexagon);
		this._initialiseEvents();
	}

	FieldView.prototype = Object.create(Subscribable.prototype);

	FieldView.prototype._initialiseEvents = function() {
		var element = this._group;
		this._hexagon.on('click', this._handleHexagonClicked.bind(this));
		element.on('dragstart', this._handleHexagonDragStart.bind(this));
		element.on('dragend', this._handleHexagonDragEnd.bind(this));
	}

	FieldView.prototype._handleHexagonClicked = function() {		
		this.fire('clicked', { source: this });
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
		this._group.remove();
	}

	FieldView.prototype.addToLayer = function(layer) {
		layer.add(this._group);		
	}

	FieldView.prototype.placePawn = function(pawn) {
		var hexagon = this._hexagon;

		hexagon.fill(pawn.owner.color);
		hexagon.dash([]);	

		this._board._layer.draw();

		var text = new Kinetic.Text({
	        x: this.x-12,
	        y: this.y,
	        text: pawn.type.slice(0,4),
	        fontSize: 15,
	        fontFamily: 'Courier New',
	        fill: pawn.color
	    });

	    this._group.add(text);
	}

	FieldView.prototype.toggleDraggable = function(toggleValue) {
		this._group.draggable(toggleValue);
	}

	FieldView.prototype.moveToTop = function() {
		this._group.moveToTop();
	}

	return FieldView;

});