define(function() {

	function Gui(game, stage) {
		this._game = game;
		this._currentPlayerText = $('.playerName');
		this._jPawnsSelect = $('#pawnsSelect');
		this.update();
		this.initialiseEvents();
	};	

	Gui.prototype.update = function() {
		this._currentPlayerText.html(this._game.currentPlayer.name);		
		this._updatePawnsStatus();
	};

	Gui.prototype._updatePawnsStatus = function() {
		var player = this._game.currentPlayer,
			jPawnsSelect = this._jPawnsSelect;

		jPawnsSelect.empty();

		player.pawns.forEach(function(pawn) {
			var jOption = $("<option />").val(pawn.type).html(pawn.type+" ("+pawn.quantity+")");
			jOption.attr('selected', player.pawn == pawn);
			jOption.attr('disabled', !pawn.quantity);
			jPawnsSelect.append(jOption);
		});
	};

	Gui.prototype.initialiseEvents = function() {
		jQuery('#pawnsSelect').on('change', function(jEvent) {
			var selectedPawnType = $(jEvent.target).val();
			this._game.currentPlayer.holdPawn(selectedPawnType);
		}.bind(this));
	};

	return Gui;

});