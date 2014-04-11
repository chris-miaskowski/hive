requirejs.config({
	baseUrl: 'app/js',
	paths: {
		'kineticjs': '../../bower_components/kineticjs/kinetic.min'
	},
	shim: {
		'kineticjs': {
			exports: 'Kinetic'
		}
	}
});

require(["kineticjs", "FieldModel"], function(Kinetic, FieldModel) {
	
	function getHexagon(x, y) {
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

	function createHexagonNextTo(hexagon, factX, factY) {
		var R = hexagon.getRadius();
		var sqrt3 = Math.sqrt(3);
		return getHexagon(
			hexagon.getX() + factX*R*sqrt3/2,
			hexagon.getY() + factY*R*3/2
		);
	}

	function createHexagonNextToForIndex(hexagon, index) {
		// Some math magic
		function yFactor(i) {
			return (Math.floor(3/(i+1)) >= 1)*(1 - i) + (Math.floor((i+1)/4) >= 1)*(i - 4);
		}

		function xFactor(i) {
			var a = Math.pow(2, (i%3)%2);
			var b = -2*Math.floor((i+1)/4) + 1;
			return a*b;
		}

		return createHexagonNextTo(hexagon, xFactor(index), yFactor(index));
	}

	var fieldModel = new FieldModel();
	var boardStructure = [];

	var stage = new Kinetic.Stage({
		container: 'boardContainer',
		width: 578,
		height: 500
	});

	var boardlayer = new Kinetic.Layer();

	var hexagon = getHexagon(stage.getWidth()/2, 
		stage.getHeight()/2);	

	function getFieldByView(view) {
		return boardStructure.filter(function(field) {
			return field.view == view;
		})[0];
	}

	function getFieldByModel(model) {
		return boardStructure.filter(function(field) {
			return field.model == model;
		})[0];
	}

	function getFieldsByModels(models) {
		return models.map(getFieldByModel);
	}

	function createField(hexagon, fieldModel) {
		console.log('creating new field');
		var field = {
			model: fieldModel,
			view: hexagon
		};		
		field.x = hexagon.getX();
		field.y = hexagon.getY();
		attachHandlers(field);
		boardStructure.push(field);
		return field;
	}

	function attachHandlers(field) {
		var hexagon = field.view;
		hexagon.on('click', handleHexagonClicked.bind(null, field));
		hexagon.on('dragstart', handleHexagonDragStart.bind(null, field));
		hexagon.on('dragend', handleHexagonDragEnd.bind(null, field));
	}

	function boardContainsFieldModel(fieldModel) {
		return boardStructure.filter(function(field) {
			return field.model == fieldModel;
		}).length > 0;
	}

	var draggedHexagon;

	function handleHexagonDragStart(field) {		
		var emptyHexagon = getHexagon(field.x, field.y),
			removedFields = getFieldsByModels(field.model.takePawnOff());

		draggedHexagon = field.view;		
		field.view = emptyHexagon;		
		attachHandlers(field);

		removedFields.forEach(function(rfield) {
			rfield.view.remove();
		});		

		boardlayer.add(emptyHexagon);
		boardlayer.draw();
		draggedHexagon.moveToTop();
	}

	function handleHexagonDragEnd(field, mouseEvent) {		
		draggedHexagon.remove();		
		draggedHexagon = null;
		boardlayer.draw();

		var dropTarget = getFieldByView(stage.getIntersection(stage.pointerPos));
		if(dropTarget) {
			handleHexagonClicked(dropTarget);			
		} else {
			handleHexagonClicked(field)
		}		
		boardlayer.draw();		
	}

	function handleHexagonClicked(field) {	
		var hexagon = field.view,
			model = field.model,
			neighbour,
			newField;

		if(!model.pawn) {

			model.placePawn("pawn");
			hexagon.fill('green');
			hexagon.draggable(true);
			hexagon.dash([]);	
			console.log("placing pawn");

			for(var i = 0; i < model.neighbours.length; i++) {
				neighbour = model.neighbours[i];
				if(!boardContainsFieldModel(neighbour)) {					
					newField = createField(
						createHexagonNextToForIndex(hexagon, i),
						neighbour
					);
					boardlayer.add(newField.view);
				}
			}
		}				
		
		boardlayer.draw();
	}	

	createField(hexagon, fieldModel);

	boardlayer.add(hexagon);
	stage.add(boardlayer);

});