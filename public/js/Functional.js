define(function() {
	var Functional = {
		dot: function(prop) {			
			return {
				eq: function (val) {
					return function(item) {
						return item[prop] == val;
					}					
				},
				gt: function(val) {
					return function(item) {
						return item[prop] > val;
					}					
				}
			}
		}
	};

	return Functional;
});