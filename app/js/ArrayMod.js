Array.prototype.find = function(item) {
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
