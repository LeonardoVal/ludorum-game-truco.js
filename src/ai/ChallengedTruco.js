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

		this.pointsWorth = 1; // To be updated on truco-kind challenges.
		this.canUpChallenge = null; // A player that can up the challenge later

		 // Collect up to now raised challenges
		this.envidoStack = [];
		this.envidoOver = false; // TODO: Update envidoOver when a challenge is raised/answered

		this.trucoStack = [];
		this.trucoOver = false; // TODO: Update trucoOver when a challenge is raised/answered
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
			var envidoChallenge = this.envidoStack[this.envidoStack.length - 1];
			var trucoChallenge = this.trucoStack[this.trucoStack.length - 1];
			if (envidoChallenge && (!this.envidoOver) &&  (this.table.length < 2)) {
				moves[this.activePlayer()] = [
					ChallengedTruco.CHALLENGES.Quiero,
					ChallengedTruco.CHALLENGES.NoQuiero
				];

				switch (envidoChallenge) {
					case ChallengedTruco.CHALLENGES.Envido:
						if (this.envidoStack.length === 1) {
							Array.prototype.push.apply(moves[this.activePlayer()], [
								ChallengedTruco.CHALLENGES.Envido
							]);
						}
						Array.prototype.push.apply(moves[this.activePlayer()], [
							ChallengedTruco.CHALLENGES.RealEnvido,
							ChallengedTruco.CHALLENGES.FaltaEnvido,
						]);
						break;
					case ChallengedTruco.CHALLENGES.RealEnvido:
						Array.prototype.push.apply(moves[this.activePlayer()], [
							ChallengedTruco.CHALLENGES.FaltaEnvido,
						]);
						break;
				}
			} else if (trucoChallenge && (!this.trucoOver)) {
				moves[this.activePlayer()] = [
					ChallengedTruco.CHALLENGES.Quiero,
					ChallengedTruco.CHALLENGES.NoQuiero
				];
				switch (lastRaisedChallenge) {
					case ChallengedTruco.CHALLENGES.Truco:
						Array.prototype.push.apply(moves[this.activePlayer()], [
							ChallengedTruco.CHALLENGES.ReTruco
						]);
						break;
					case ChallengedTruco.CHALLENGES.ReTruco:
						Array.prototype.push.apply(moves[this.activePlayer()], [
							ChallengedTruco.CHALLENGES.ValeCuatro
						]);
						break;
				}
			} else {
				Array.prototype.push.apply(moves[this.activePlayer()], [
					ChallengedTruco.CHALLENGES.Truco,
				]);
				if (this.table.length <= 1) {
					Array.prototype.push.apply(moves[this.activePlayer()], [
						ChallengedTruco.CHALLENGES.Envido,
						ChallengedTruco.CHALLENGES.RealEnvido,
						ChallengedTruco.CHALLENGES.FaltaEnvido
					]);
				}
			}
		}
		return moves;
	},

	/** TODO
	*/
	result: function result() {
		return SubTruco.prototype.result.call(this);
	},

	/** TODO
	*/
	next: function next(moves, haps, update) {
		var activePlayer = this.activePlayer();
		var move = +moves[activePlayer];

		if (move > 2) {
			var that = update ? this : this.clone();
			var envidoChallenge = that.envidoStack[that.envidoStack.length - 1];
			var trucoChallenge = that.trucoStack[that.trucoStack.length - 1];
			switch (move) {
				case ChallengedTruco.CHALLENGES.Quiero:
					if (envidoChallenge) {
						var handEnvido = envidoTotal(that.cardsHand);
						var footEnvido = envidoTotal(that.cardsFoot);
						var envidoWinner = handEnvido > footEnvido ? 'Hand' : 'Foot';
						// TODO: (meeting) How are the different ENVIDO scores published
						// in Game.result()?
						var envidoPoints = that.envidoStackWorth()[0];
					} else if (trucoChallenge) {
						that.pointsWorth = that.trucoStackWorth();
						if (trucoChallenge != ChallengedTruco.CHALLENGES.ValeCuatro) {
							that.canUpChallenge = activePlayer;
						}
					} else {
						// IMPOSSIBLE
					}
					break;
				case ChallengedTruco.CHALLENGES.NoQuiero:
					if (envidoChallenge) {
						var envidoPoints = that.envidoStackWorth()[1];
						// TODO: Assign score to the challenging player, game continues
					} else if (trucoChallenge) {
						var challengerScore = that.trucoStackWorth() - 1;
						// TODO: Assign score to the challenging player, game over
					} else {
						// IMPOSSIBLE
					}
					break;

				case ChallengedTruco.CHALLENGES.Truco:
					that.canUpChallenge = null;
					that.trucoStack.push(ChallengedTruco.CHALLENGES.Truco);
					break;
				case ChallengedTruco.CHALLENGES.ReTruco:
					that.canUpChallenge = null;
					that.trucoStack.push(ChallengedTruco.CHALLENGES.ReTruco);
					break;
				case ChallengedTruco.CHALLENGES.ValeCuatro:
					that.canUpChallenge = null;
					that.trucoStack.push(ChallengedTruco.CHALLENGES.ValeCuatro);
					break;
				case ChallengedTruco.CHALLENGES.Envido:
					that.envidoStack.push(ChallengedTruco.CHALLENGES.Envido);
					break;
				case ChallengedTruco.CHALLENGES.RealEnvido:
					that.envidoStack.push(ChallengedTruco.CHALLENGES.RealEnvido);
					break;
				case ChallengedTruco.CHALLENGES.FaltaEnvido:
					that.envidoStack.push(ChallengedTruco.CHALLENGES.FaltaEnvido);
					break;

			}

		} else {
			return SubTruco.prototype.next.call(this, moves, haps, update);
		}

		return null;
	},

	// ## Utility methods ##########################################################################

	clone: function clone() {
		var cloned_game = new this.constructor(
			this.table.slice(),
			this.cardsHand.slice(),
			this.cardsFoot.slice(),
			this.globalScore);

		cloned_game.envidoStack = this.envidoStack.slice();
		cloned_game.trucoStack = this.trucoStack.slice();

		return cloned_game;
	},

	trucoStackWorth: function trucoStackWorth() {
		return this.trucoStack.length + 1;
		// Truco: 2
		// Truco, ReTruco: 3
		// TRUCO; ReTruco, ValeCuatro: 4
	},

	/**
	 * When envido challenges are called their effect is cumulative. If an _Envido_ is answered to
	 * with a _Real Envido_ then it is worth 5 (2 + 3) points. Not all sequences are allowed.
	 * Below is the list of allowed _Envido_ type challenge chains, along with the points given to
	 * the winner or when it is declined.
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
	envidoStackWorth: function envidoStackWorth() {
		if (this.envidoStack.length) {
			return null;
		}
		var wanted = 1;
		var notWanted = 0;
		for (var i = 0; i < this.envidoStack.length; i++) {
			notWanted = wanted;
			switch (this.envidoStack[i]) {
				case ChallengedTruco.CHALLENGES.Envido:
					wanted += 2;
					break;
				case ChallengedTruco.CHALLENGES.RealEnvido:
					notWanted = wanted;
					wanted += 3;
					break;
				case ChallengedTruco.CHALLENGES.FaltaEnvido:
					return [this.faltaEnvidoScore(), notWanted];
			}
		}
		return [wanted, notWanted];
	},

	/**
	 * The _Falta Envido_ challenge depends on the global game status. If both players are in
	 * _malas_ (up to 15 points each), the player that wins the _Falta Envido_ wins the  global
	 * game. If at least one player is above 15 points this challenge is worth the amount of points
	 * necessary for the winning player to win the global game.
	 */
	faltaEnvidoScore: function faltaEnvidoScore() {
		var handGlobal = this.globalScore[0];
		var footGlobal = this.globalScore[1];
		if (handGlobal <= 15 && footGlobal <= 15) {
			if (this.activePlayer() === 'Hand') {
				return 30 - handGlobal;
			} else {
				return 30 - footGlobal;
			}
		} else {
			return 30 - Math.max(handGlobal, footGlobal);
		}
	},

    /**

     */
	'static CHALLENGES': {
		'Truco': 3,
		'ReTruco': 4,
		'ValeCuatro': 5,
		'Envido': 6,
		'RealEnvido': 7,
		'FaltaEnvido': 8,
		'Quiero': 9,
		'NoQuiero': 10
	},


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