define(['underscore'], function(_) {
	
	Array.prototype.find = function(predicate) {
		if(typeof(predicate) === 'function') {
			item = this.filter(predicate)[0];
		} else {
			item = predicate;
		}
		return this[this.indexOf(item)];
	}

	Array.prototype.remove = function(predicate) {
		var items;

		if(typeof(predicate) === 'function') {
			items = this.filter(predicate);
		} else {
			items = predicate;
		}

		if(!Array.isArray(items)) {
			items = [].concat(items);
		}

		items.forEach(function(item) {
			var index = this.indexOf(item);
			if(index != -1) this.splice(index, 1);
		}.bind(this));
	}

});