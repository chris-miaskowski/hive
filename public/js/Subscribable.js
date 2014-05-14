define(function() {

	function Subscribable() {
		this._listeners = {};
	}	

	Subscribable.prototype.on = function(eventName, eventHandler, context) {
		var queuedListeners = this._listeners[eventName] || [];
		queuedListeners.push([context, eventHandler]);
		this._listeners[eventName] = queuedListeners;
	};

	Subscribable.prototype.fire = function(eventName, eventData) {
		var queue = this._listeners[eventName];
		if(queue) {
			queue.forEach(function(queueItem){
				queueItem[1].call(queueItem[0], eventData);
			});
		}
	};

	return Subscribable;

});