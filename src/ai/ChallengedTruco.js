/** # ChallengedTruco

A complete (but of complete information) version of the _truco_ subgame, with challenges.
*/
var ChallengedTruco = exports.ai.ChallengedTruco = declare(SubTruco, {
	name: 'ChallengedTruco',

	/** The constructo takes:
	+ `table`: An array with the cards on the table,
	+ `cardsHand`: An array with the cards on the first player's hand,
    + `cardsFoot`: An array with the cards on the second player's hand.
    + `globalScore`: An array with the current score of the players, regarding the global game of 30 points.
	*/
	constructor: function ChallengedTruco(table, cardsHand, cardsFoot, globalScore) {
		SubTruco.call(this, table, cardsHand, cardsFoot);
		this.globalScore = globalScore;

		this.trucoState = [];
		this.currentTrucoChallenge = null;
		// initialization
	},

	/** The players' roles in a ChallengedTruco match are `"Hand"` (_Mano_) and `"Foot"` (_Pie_).
	*/
	players: ["Hand", "Foot"],

	// ## Game logic ###############################################################################

	/** A move for `ChallengedTruco` can be either either the index of the card to be played in the
    active player's hand or a challenge, as defined in 'static CHALLENGES'.
    If there is a challenge currently proposed the moves are 0 or 1 as declining or accepting said
    challenge.
	*/
	moves: function moves() {
		var moves = SubTruco.prototype.moves.call(this);
		if (moves) {
			if (this.currentTrucoChallenge) {
				// TODO: Consider possible responses to the challenge
			} else {
				var challengeMoves = [3];
				Array.prototype.push.apply(moves[this.activePlayer()], challengeMoves);
			}
		}
		return moves;
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

    /**

     */
	'static CHALLENGES': [
		[], [], [],      // 0-2: Invalid
		["Truco"],       // 3: _Truco_ challenge, bet 2 points
		["ReTruco"],     // 4: _Re Truco_ challenge, bet 3 points
		["Vale Cuatro"], // 5: _Vale Cuatro_ challenge, bet 4 points
		["Envido"], 	 // 6: _Envido_ challenge, 2 points to the winner
		["Real Envido"], // 7: _Real Envido_ challenge, 3 points to the winner
		["Falta Envido"], // 8: _Falta Envido_ challenge, explained below
	],

	/**
	 * The _Falta Envido_ challenge depends n the global game status. If both players are in _malas_
	 * (up to 15 points each), the player that wins the _Falta Envido_ wins the global game. If at least
	 * one player is above 15 points this challenge is worth the amount of points necessary for the winning
	 * player to win the global game.
	 *
	 * When envido challenges are called their effect is cumulative. If an _Envido_ is answered to with a
	 * _Real Envido_ then it is worth 5 (2 + 3) points. Not all sequences are allowed. Below is the list
	 * of allowed _Envido_ type challenge chains, along with the points given to the winner or when it is declined.
	 *
	 * E               2/1
	 * RE              3/1
	 * FE              x/1
	 * E, E            4/2
	 * E, RE           5/2
	 * E, E, RE        7/4
	 * E, E, RE, FE    x/7
	 * E, FE           x/2
	 * RE, FE          x/3
	 * E, E, FE        x/4
	 * E, RE, FE       x/5
	 */

	/** Serialization is used in the `toString()` method, but it is also vital for sending the game
	state across a network or the marshalling between the rendering thread and a webworker.
	*/
	'static __SERMAT__': {
		identifier: exports.__package__ + '.ChallengedTruco',
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