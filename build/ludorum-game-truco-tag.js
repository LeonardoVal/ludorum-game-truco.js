(function (init) { "use strict";
			this["ludorum-game-truco"] = init(this.base,this.Sermat,this.ludorum);
		}).call(this,/** Package wrapper and layout.
*/
function __init__(base, Sermat, ludorum) { "use strict";
// Import synonyms. ////////////////////////////////////////////////////////////////////////////////
	var declare = base.declare,
		raise = base.raise,
		raiseIf = base.raiseIf,
		Iterable = base.Iterable,
		iterable = base.iterable,
		Game = ludorum.Game,
		UserInterface = ludorum.players.UserInterface;

// Library layout. /////////////////////////////////////////////////////////////////////////////////
	var exports = {
		__package__: 'ludorum-game-truco',
		__name__: 'ludorum_game_truco',
		__init__: __init__,
		__dependencies__: [base, Sermat, ludorum],
		__SERMAT__: { include: [base, ludorum] },

		/** The `ai` is the namespace used for functions and definitions relating to artificial
		intelligence.
		*/
		ai: { }
	};


/** # Common functions and utilities.

TODO
*/

/** # Truco base

Base abstract class for implementations of variants of the Truco card game.
*/
var Truco = exports.Truco = declare(Game, {
	name: 'Truco',

	/** TODO
	*/
	constructor: function Truco(activePlayer){
		Game.call(this, activePlayer);
		// initialization
	},

	/** The players' roles in a Truco match are `"Hand"` (_Mano_) and `"Foot"` (_Pie_).
	*/
	players: ["Hand", "Foot"],

	// ## Game logic ###############################################################################

	/** TODO
	*/
	moves: function moves(){
		return null;
	},

	/** TODO
	*/
	result: function result() {
		return null;
	},

	/** TODO
	*/
	next: function next(moves, haps, update) {
		return null;
	},

	// ## Utility methods ##########################################################################

	/** Serialization is used in the `toString()` method, but it is also vital for sending the game
	state across a network or the marshalling between the rendering thread and a webworker.
	*/
	'static __SERMAT__': {
		identifier: exports.__package__ +'.Truco',
		serializer: function serialize_Mancala(obj) {
			return [obj.activePlayer()];
		}
	}
}); // declare Truco.

// ## Truco type initialization ####################################################################

/** Sermat serialization.
*/
exports.__SERMAT__.include.push(Truco);
Sermat.include(exports);

/** # SubTruco

Simplified version of the _truco_ subgame of the Truco card game, made to investigate the game.
*/
var SubTruco = exports.ai.SubTruco = declare(Game, {
	name: 'Truco',

	/** TODO
	*/
	constructor: function SubTruco(activePlayer){
		Game.call(this, activePlayer);
		// initialization
	},

	/** The players' roles in a Truco match are `"Hand"` (_Mano_) and `"Foot"` (_Pie_).
	*/
	players: ["Hand", "Foot"],

	// ## Game logic ###############################################################################

	/** TODO
	*/
	moves: function moves(){
		return null;
	},

	/** TODO
	*/
	result: function result() {
		return null;
	},

	/** TODO
	*/
	next: function next(moves, haps, update) {
		return null;
	},

	// ## Utility methods ##########################################################################

	/** Serialization is used in the `toString()` method, but it is also vital for sending the game
	state across a network or the marshalling between the rendering thread and a webworker.
	*/
	'static __SERMAT__': {
		identifier: exports.__package__ +'.SubTruco',
		serializer: function serialize_Mancala(obj) {
			return [obj.activePlayer()];
		}
	}
}); // declare Truco.

// ## Truco type initialization ####################################################################

/** Sermat serialization.
*/
exports.__SERMAT__.include.push(SubTruco);
Sermat.include(exports);

// See __prologue__.js
	Sermat.include(exports);
	
	return exports;
}
);
//# sourceMappingURL=ludorum-game-truco-tag.js.map