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
	        dash: [8, 5]
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

	var layer = new Kinetic.Layer();

	var hexagon = getHexagon(stage.getWidth()/2, 
		stage.getHeight()/2);	

	function createField(hexagon, fieldModel) {
		console.log('creating new field');
		var field = {
			model: fieldModel,
			view: hexagon
		};
		hexagon.on('click', handleHexagonClicked.bind(null, field));
		boardStructure.push(field);
		return field;
	}

	function boardContainsFieldModel(fieldModel) {
		return boardStructure.filter(function(field) {
			return field.model == fieldModel;
		}).length > 0;
	}

	function handleHexagonClicked(field) {	
		var hexagon = field.view,
			model = field.model,
			neighbour,
			newField;

		if(!model.pawn) {

			model.placePawn("pawn");
			hexagon.fill('green');
			hexagon.dash([]);	
			console.log("placing pawn");

			for(var i = 0; i < model.neighbours.length; i++) {
				neighbour = model.neighbours[i];
				if(!boardContainsFieldModel(neighbour)) {					
					newField = createField(
						createHexagonNextToForIndex(hexagon, i),
						neighbour
					);
					layer.add(newField.view);
				}
			}
		}				
		
		layer.draw();
	}	

	createField(hexagon, fieldModel);

	layer.add(hexagon);
	stage.add(layer);

});