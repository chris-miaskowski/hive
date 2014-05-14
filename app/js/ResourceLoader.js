define(['rsvp'], function(Rsvp) {

	function ResourceLoader() {

	}

	ResourceLoader.prototype.loadResources = function() {
		var imageNames = ['ant', 'spider', 'bee', 'beetle', 'grasshopper'],
			imagePromises = imageNames.map(function(fileName) {
				return promiseImage('app/img/{0}.png'.replace('{0}', fileName), fileName);
			});

		return Rsvp.all(imagePromises).then(function(images) {
			return images.reduce(function(resourceLibrary, data) {
				resourceLibrary[data.name] = data.image;
				return resourceLibrary;
			}, 
			{});
		});
	};

	function promiseImage(url, fileName) {
		var promise = new Rsvp.Promise(function(resolve, reject) {
			var image = new Image();
			image.onload = function() {
				resolve({ image: this, name: fileName });
			};
			image.src = url;
		});
		return promise;
	}

	function createKineticImage(image, x, y, width, height) {
		var kimage = new Kinetic.Image({
			image: this,
			x: 0,
			y: 0,
			width: 40,
			height: 40
		});				
		return kimage;
	}	

	return ResourceLoader;
});