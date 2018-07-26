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