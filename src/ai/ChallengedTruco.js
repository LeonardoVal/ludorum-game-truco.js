/** # ChallengedTruco

A complete (but of complete information) version of the _truco_ subgame, with challenges.
*/
var ChallengedTruco = exports.ai.ChallengedTruco = declare(SubTruco, {
	name: 'ChallengedTruco',

	/** The constructor takes:
	 *
	 * `table`: An array with the cards on the table,
	 * `cardsHand`: An array with the cards on the first player's hand,
	 * `cardsFoot`: An array with the cards on the second player's hand.
	 * `globalScore`: An object with the current score of the players, regarding the global game of 30 points.
	 */
	constructor: function ChallengedTruco(table, cardsHand, cardsFoot, globalScore) {
		SubTruco.call(this, table, cardsHand, cardsFoot);

		this.trucoWinner = null;

		if (!globalScore) {
			this.globalScore = {'Hand': 0, 'Foot': 0};
		} else {
			this.globalScore = globalScore;
		}

		 // _Envido_ related
		this.envidoStack = [];
		this.envidoGoing = false; // TODO: Update envidoGoing when a challenge is raised/answered

		// _Truco_ related
		this.trucoStack = [];
		this.trucoGoing = false; // TODO: Update trucoGoing when a challenge is raised/answered
		this.canUpChallenge = null; // A player that can up the challenge later

		// The player that raised the first challenge in the current chain
		// Necessary to give the turn to the correct player after a chain of upped challenges
		this.trucoChallenger = null;
	},

	/** Clones the game to create apparently inmutable progression **/
	clone: function clone() {
		var gclone = new this.constructor(
			this.table.slice(),
			this.cardsHand.slice(),
			this.cardsFoot.slice(),
			this.globalScore);

		gclone.trucoWinner = this.trucoWinner;

		gclone.envidoStack = this.envidoStack.slice();
		gclone.envidoGoing = this.envidoGoing;

		gclone.trucoStack = this.trucoStack.slice();
		gclone.trucoGoing = this.trucoGoing;
		gclone.canUpChallenge = this.canUpChallenge;

		gclone.trucoChallenger = this.trucoChallenger;

		return gclone;
	},

	/** The players' roles in a ChallengedTruco match are `"Hand"` (_Mano_) and `"Foot"` (_Pie_). */
	players: ["Hand", "Foot"],

	// ## Game logic ###############################################################################

	/**
	 * A move in `ChallengedTruco` can be either either a `SubTruco` move or a challenge, as defined
	 * in 'static CHALLENGES'. If there is a challenge currently proposed the moves are declining or
	 * accepting said challenge, or in  some cases upping the bet.
	 */
	moves: function moves() {
		var envidoChall = this.getEnvidoChallenge();
		var trucoChall = this.getTrucoChallenge(); // Gets the last truco challenge (active)

		var moves = SubTruco.prototype.moves.call(this);

		if (this.envidoGoing) {
			moves[this.activePlayer()] = [
				ChallengedTruco.CHALLENGES.Quiero,
				ChallengedTruco.CHALLENGES.NoQuiero
			];
			Array.prototype.push.apply(moves[this.activePlayer()], this.envidoResponses());
		} else if (this.trucoGoing) {
			// A _truco_ challenge has been posed and needs to be answered

			moves[this.activePlayer()] = [
				ChallengedTruco.CHALLENGES.Quiero,
				ChallengedTruco.CHALLENGES.NoQuiero
			];
			// Additionally the player can up the challenge by betting more points
			Array.prototype.push.apply(moves[this.activePlayer()], this.trucoResponses());
		} else {
			// No challenges are in negotiation. Can raise new ones or play normally
			if (this.table.length < 2) {
				// The game is still on its firts round, and _Envido_ challenges can be raised
				Array.prototype.push.apply(moves[this.activePlayer()], this.envidoResponses());
			}

			if (!trucoChall || this.canUpChallenge === this.activePlayer()) {
				// No truco challenges have been made 
				// OR the current player has `el quiero` (can make further challenges)
				Array.prototype.push.apply(moves[this.activePlayer()], this.trucoResponses());
			}
		}
		return moves;
	},

	/** Gives the result of the game */
	result: function result() {
		var sub = SubTruco.prototype.result.call(this);
		if (sub) {
			return sub;
		} else if (this.trucoWinner) {
			// TODO (reunion): Assign score to the challenging player, game over
			return this.victory(this.trucoWinner);
		}
	},

	/**
	 * Changes the state of the game (mutating if `update` is `true`) by either applying
	 * the `SubTruco` move or dealing with a posed or answered challenge.
	 */
	next: function next(moves, haps, update) {
		base.raiseIf(this.result(), "Game is finished!");
		var activePlayer = this.activePlayer();
		var move = +moves[activePlayer];

		if (move <= 2) {
			return SubTruco.prototype.next.call(this, moves, haps, update);
		} else {
			var that = update ? this : this.clone();
			var nextPlayer = this.opponent();
			var envidoChallenge = that.getEnvidoChallenge();
			var trucoChall = that.getTrucoChallenge();

			switch (move) {
				case ChallengedTruco.CHALLENGES.Quiero:
					if (envidoChallenge) {
						var handEnvido = envidoTotal(that.cardsHand);
						var footEnvido = envidoTotal(that.cardsFoot);
						var envidoWinner = handEnvido >= footEnvido ? 'Hand' : 'Foot';
						var envidoWinPoints = that.envidoStackWorth()[0];
						that.envidoGoing = false;
						// TODO: (meeting) How are the different ENVIDO scores published
						// in Game.result()?
					} else if (trucoChall) {
						that.trucoGoing = false;
						that.canUpChallenge = (trucoChall !== ChallengedTruco.CHALLENGES.ValeCuatro) ? activePlayer : null;
						nextPlayer = this.trucoChallenger;
						that.trucoChallenger = null;
					} else { /* IMPOSSIBLE */ }
					break;

				case ChallengedTruco.CHALLENGES.NoQuiero:
					if (envidoChallenge) {
						that.envidoGoing = false;
						var envidoNotWantedPoints = that.envidoStackWorth()[1];
						// TODO: Assign score to the challenging player, game continues
					} else if (trucoChall) {
						that.trucoGoing = false;
						var challengerScore = that.trucoStackWorth() - 1;
						var op = this.opponent();
						that.trucoWinner = op;
					} else { /* IMPOSSIBLE */ }
					break;

				case ChallengedTruco.CHALLENGES.Truco:
				case ChallengedTruco.CHALLENGES.ReTruco:
				case ChallengedTruco.CHALLENGES.ValeCuatro:
					if (!this.trucoChallenger) {
						that.trucoChallenger = activePlayer;
					}
					that.canUpChallenge = null;
					that.trucoGoing = true;
					that.trucoStack.push(move);
					break;

				case ChallengedTruco.CHALLENGES.Envido:
				case ChallengedTruco.CHALLENGES.RealEnvido:
				case ChallengedTruco.CHALLENGES.FaltaEnvido:
					that.envidoGoing = true;
					that.envidoStack.push(move);
					break;
			}
			that.activatePlayers(nextPlayer);
			return that;
		}
	},

	// ## Utility methods ##########################################################################

	/** Calculates the value of the game based on the trucoStack **/
	trucoStackWorth: function trucoStackWorth() {
		return this.trucoStack.length + 1;
		// Truco: 2
		// Truco, ReTruco: 3
		// TRUCO; ReTruco, ValeCuatro: 4
	},

	getEnvidoChallenge: function() {
		return this.envidoStack[this.envidoStack.length - 1];
	},

	getTrucoChallenge: function() {
		return this.trucoStack[this.trucoStack.length - 1];
	},

	/**
	 * When envido challenges are called their effect is cumulative. If an _Envido_ is answered to
	 * with a _Real Envido_ then it is worth 5 (2 + 3) points. Not all sequences are allowed.
	 * Below is the list of allowed _Envido_ type challenge chains, along with the points given to
	 * the winner, or to the caller when it is not accepted.
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

	envidoResponses: function envidoResponses() {
		var envidoChall = this.getEnvidoChallenge();
		var possibleMoves = [];

		if (!envidoChall || envidoChall < ChallengedTruco.CHALLENGES.FaltaEnvido) {
			possibleMoves.push(ChallengedTruco.CHALLENGES.FaltaEnvido);
		}

		if (!envidoChall || envidoChall < ChallengedTruco.CHALLENGES.RealEnvido) {
			possibleMoves.push(ChallengedTruco.CHALLENGES.RealEnvido);
		}

		if (!envidoChall || envidoChall < ChallengedTruco.CHALLENGES.Envido) {
			possibleMoves.push(ChallengedTruco.CHALLENGES.Envido);
		}

		if (envidoChall === ChallengedTruco.CHALLENGES.Envido && this.envidoStack.length === 1) {
			possibleMoves.push(ChallengedTruco.CHALLENGES.Envido);
		}

		return possibleMoves;
	},

	trucoResponses: function trucoResponses() {
		var trucoChall = this.getTrucoChallenge();

		switch (trucoChall) {
			case ChallengedTruco.CHALLENGES.Truco:
				return [ChallengedTruco.CHALLENGES.ReTruco];
			case ChallengedTruco.CHALLENGES.ReTruco:
				return [ChallengedTruco.CHALLENGES.ValeCuatro];
			default:
				return [ChallengedTruco.CHALLENGES.Truco];
		}
	},

	/**
	 * The _Falta Envido_ challenge depends on the global game status. If both players are in
	 * _malas_ (up to 15 points each), the player that wins the _Falta Envido_ wins the  global
	 * game. If at least one player is above 15 points this challenge is worth the amount of points
	 * necessary for the winning player to win the global game.
	 */
	faltaEnvidoScore: function faltaEnvidoScore() {
		var handGlobal = this.globalScore.Hand;
		var footGlobal = this.globalScore.Foot;
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
