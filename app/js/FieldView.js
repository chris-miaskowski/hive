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

	function createKineticImage(image, x, y, width, height) {
		var kimage = new Kinetic.Image({
			image: image,
			x: x,
			y: y,
			width: width,
			height: height
		});				
		return kimage;
	}	

	var FieldView = function (x, y, model) {	
		Subscribable.prototype.constructor.call(this);
		this.model = model;
		this.x = x;
		this.y = y;
		this._hexagon = emptyField(x, y);	
		this._group = new Kinetic.Group({}); 	
	    this._group.add(this._hexagon);
		this._initialiseEvents();
	}

	FieldView.prototype = Object.create(Subscribable.prototype);

	FieldView.prototype._initialiseEvents = function() {
		var element = this._group,
			eventData = { source: this };

		element.on('click', this.fire.bind(this, 'clicked', eventData));
		element.on('dragstart', this.fire.bind(this, 'dragstart', eventData));
		element.on('dragend', this.fire.bind(this, 'dragend', eventData));
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
		var hexagon = this._hexagon,
			image;

		hexagon.fill(pawn.owner.color);
		hexagon.dash([]);			

		image = createKineticImage(
			ResourceLibrary[pawn.type.toLowerCase()], 
			this.x - hexagon.radius()/2, 
			this.y - hexagon.radius()/2,
			40,
			40);

	    this._group.add(image);
	}

	FieldView.prototype.toggleDraggable = function(toggleValue) {
		this._group.draggable(toggleValue);
	}

	FieldView.prototype.moveToTop = function() {
		this._group.moveToTop();
	}

	return FieldView;

});