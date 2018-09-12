/** # ChallengedTruco

A complete (but of complete information) version of the _truco_ subgame, with challenges.
*/
var ChallengedTruco = exports.ChallengedTruco = declare(SubTruco, {
	name: 'ChallengedTruco',

	/** TODO
	*/
	constructor: function ChallengedTruco(activePlayer){
		Game.call(this, activePlayer);
		// initialization
	},

	/** The players' roles in a ChallengedTruco match are `"Hand"` (_Mano_) and `"Foot"` (_Pie_).
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
		identifier: exports.__package__ +'.ChallengedTruco',
		serializer: function serialize_Mancala(obj) {
			return [obj.activePlayer()];
		}
	}
}); // declare ChallengedTruco.

// ## ChallengedTruco type initialization ####################################################################

/** Sermat serialization.
*/
exports.__SERMAT__.include.push(ChallengedTruco);
Sermat.include(exports);