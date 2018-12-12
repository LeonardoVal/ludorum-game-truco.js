(function (init) { "use strict";
			if (typeof define === 'function' && define.amd) {
				define(["creatartis-base","sermat","ludorum"], init); // AMD module.
			} else if (typeof exports === 'object' && module.exports) {
				module.exports = init(require("creatartis-base"),require("sermat"),require("ludorum")); // CommonJS module.
			} else {
				this["ludorum-game-truco"] = init(this.base,this.Sermat,this.ludorum); // Browser.
			}
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

/**
 * A card move is represented by an object with a player (who throws the card)
 * and a number, which is the index of the thrown card
 *
 * Note that cards are sorted in ascending order so index is consistent
 */

/**
 * Funcion que recibe por parametro la mano actual de un jugador, y retorna los posibles movimientos.
 */

function generateMoves(cards) {
    var moves = [];
    for (var i = 0; i < cards.length; i++) {
        moves.push(i);
    }
    return moves;
}

function arrEq(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
}

function envidoTotal(cards) {
    var a = envido(cards[0], cards[1]);
    var b = envido(cards[0], cards[2]);
    var c = envido(cards[1], cards[2]);

    return Math.max(a, b, c);
}

/**
 * Cada carta se representa con un entero del 0 al 39.
 *
 * Dado que hay 10 cartas de cada palo, y son 4 palos,
 * el palo de una carta n es n mod 4.
 *
 * Su número es n // 4 + 1 (para hacerlo de 1 a 10).
 *
 * PALOS
 * 0 - Espada
 * 1 - Basto
 * 2 - Oro
 * 3 - Copa
 *
 * CARTAS
 * 1..7 - 1..7
 * 8 - 10
 * 9 - 11
 * 10 - 12
 */

function envido(a, b) {
    var valor = (a % 4) == (b % 4) ? 20 : 0;
    var numA = ~~(a / 4) + 1;
    var numB = ~~(b / 4) + 1;
    if (numA < 8) {
        valor += numA;
    }
    if (numB < 8) {
        valor += numB;
    }
    return valor;
}

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
	name: 'SubTruco',

	/** The constructor takes:
	+ `table`: An array with the cards on the table,
	+ `cardsHand`: An array with the cards on the first player's hand,
	+ `cardsFoot`: An array with the cards on the second player's hand.
	*/
	constructor: function SubTruco(table, cardsHand, cardsFoot) {
		Game.call(this, this.players[table.length % 2]);
		this.table = table;
		this.cardsHand = cardsHand;
		this.cardsFoot = cardsFoot;
	},

	/** The players' roles in a Truco match are `"Hand"` (_Mano_) and `"Foot"` (_Pie_).
	*/
	players: ["Hand", "Foot"],

	// ## Game logic ###############################################################################

	/** A move for `SubTruco` is simply the index for the card to be played in the active player's
	hand.
	*/
	moves: function moves() {
		var moves = this.result() ? null : {};
		if (moves) {
			var cards = this.activePlayer() === 'Hand' ? this.cardsHand : this.cardsFoot;
			moves[this.activePlayer()] = cards.map((_, i) => i);
		}
		return moves;
	},

	/** The table results are the matches between the cards of each player in the table.
	*/
	__tableResults__: function __tableResults__() {
		var r = [];
		for (var i = 0; i < this.table.length; i += 2) {
			r.push(Math.sign(this.table[i] - this.table[i+1]));
		}
		return r;
	},

	/** The round may end when both players have played two cards, if one player wins both card
	matches or wins one with the other being tied. The round must end when both players have played
	all their three cards. If the last card match is tied, the player that won the first card match
	wins. If all three card matches are tied, the _Hand_ player wins.
	*/
	result: function result() {
		var tableResults = this.__tableResults__(),
			tableResultSum;
		if (tableResults.length == 2) {
			tableResultSum = tableResults[0] + tableResults[1];
			if (tableResultSum > 0) {
				return this.victory('Hand');
			} else if (tableResultSum < 0) {
				return this.victory('Foot');
			}
		} else if (tableResults.length === 3) {
			tableResultSum = tableResults[0] + tableResults[1] + tableResults[2];
			if (tableResultSum > 0 || tableResultSum === 0 && tableResults[0] >= 0) {
				return this.victory('Hand');
			} else if (tableResultSum < 0 || tableResultSum === 0 && tableResults[0] < 0) {
				return this.victory('Foot');
			}
		}
		return null;
	},

	/** TODO
	*/
	next: function next(moves, haps, update) {
		base.raiseIf(this.result(), "Game is finished!");
		var that = update ? this : this.clone(),
			activePlayer = this.activePlayer(),
			move = +moves[activePlayer],
			cards = that['cards'+ activePlayer];
		base.raiseIf(move < 0 || move >= cards.length, 'Invalid move ', move, 'at', that, '!');
		that.table.push(cards[move]);
		cards.splice(move, 1);
		that.activatePlayers(this.opponent());
		return that;
	},

	// ## Utility methods #########################################################################

	clone: function clone() {
		return new this.constructor(this.table.slice(), this.cardsHand.slice(),
			this.cardsFoot.slice());
	},

	/** The string `identifier` for a `SubTruco` state always has 7 characters. The first one
	indicates the number of cards on the table. Then come the cards on the table, each encoded as
	a character (base 36). After that come the cards of the _Hand_ player, and finally the ones of
	the _Foot_ player, both encoded in the same way as the cards on the table.
	*/
	identifier: function identifier() {
		var toChar = (n) => (n - 1).toString(36);
		return this.table.length + this.table.map(toChar).join('') +
			this.cardsHand.map(toChar).join('') +
			this.cardsFoot.map(toChar).join('');
	},

	/** For this game suits are relevant only in the case of the sevens and the aces. Hence, cards
	are encoded using numbers from 1 to 14. How each number may map to a given card is defined in
	`CARDS`. Here the french deck's suits are used instead of the spanish deck's ones (because the
	latter are not supported by Unicode). Spades and clubs are the same, diamonds are used for
	golds and hearts for cups.
	*/
	'static CARDS': [
		[],                    //  0: Invalid.
		['4♦','4♥','4♠','4♣'], //  1: All fours.
		['5♦','5♥','5♠','5♣'], //  2: All fives.
		['6♦','6♥','6♠','6♣'], //  3: All sixes.
		['7♥','7♣'],           //  4: Sevens of hearts (cups) and clubs.
		['A♦','A♥','A♠','A♣'], //  5: All jacks (10s).
		['B♦','B♥','B♠','B♣'], //  6: All knights (11s).
		['C♦','C♥','C♠','C♣'], //  7: All kings (12s).
		['1♦','1♥'],           //  8: Aces of diamonds (golds) and hearts (cups).
		['2♦','2♥','2♠','2♣'], //  9: All twos.
		['3♦','3♥','3♠','3♣'], // 10: All threes.
		['7♦'],                // 11: Seven of diamonds (golds).
		['7♠'],                // 12: Seven of spades.
		['1♣'],                // 13: Ace of clubs.
		['1♠']                 // 14: Ace of spades.
	],

	/** The `enumerateCards` function returns an iterable of all possible hands for `SubTruco`. The
	order of the cards in each players' hand is not relevant. The amount of possible cards is
	checked by means of a regular expression.
	*/
	'static enumerateCards': function enumerateCards() {
		var It = base.Iterable,
			baseSequence = It.product.apply(It, It.repeat(It.range(1,14), 6).toArray());
		return baseSequence.filter(function (cards) {
			cards = cards.map((n) => n.toString(36));
			var cardsHand = cards.slice(0, 3),
				cardsFoot = cards.slice(3, 6),
				sortedCards = cards.sort().join(''),
				amountsRegExp = /([1235679a])\1{4,}|444+|888+|bb+|cc+|dd+|ee+/;
			return cardsHand.join('') === cardsHand.sort().join('') &&
				cardsFoot.join('') === cardsFoot.sort().join('') &&
				!amountsRegExp.test(sortedCards);
		}, function (cards) {
			return [cards.slice(0,3), cards.slice(3,6)];
		});
	},

	/** Serialization is used in the `toString()` method, but it is also vital for sending the game
	state across a network or the marshalling between the rendering thread and a webworker.
	*/
	'static __SERMAT__': {
		identifier: exports.__package__ +'.SubTruco',
		serializer: function serialize_SubTruco(obj) {
			return [obj.table, obj.cardsHand, obj.cardsFoot];
		}
	}
}); // declare Truco.

// ## SubTruco type initialization #################################################################

/** Sermat serialization.
*/
exports.__SERMAT__.include.push(SubTruco);
Sermat.include(exports);

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
	},

	/** The players' roles in a ChallengedTruco match are `"Hand"` (_Mano_) and `"Foot"` (_Pie_).
	*/
	players: ["Hand", "Foot"],

	// ## Game logic ###############################################################################

	/**
	 * A move in `ChallengedTruco` can be either either a `SubTruco` move or a challenge, as defined
	 * in 'static CHALLENGES'. If there is a challenge currently proposed the moves are declining or
	 * accepting said challenge, or in  some cases upping the bet.
	 */
	moves: function moves() {
		var envidoChall = this.getEnvidoChallenge();
		var trucoChall = this.getTrucoChallenge();

		var moves = SubTruco.prototype.moves.call(this);

		if (this.envidoGoing) {
			moves[this.activePlayer()] = [
				ChallengedTruco.CHALLENGES.Quiero,
				ChallengedTruco.CHALLENGES.NoQuiero
			];
			Array.prototype.push.apply(moves[this.activePlayer()], this.envidoResponses());
		} else if (this.trucoGoing) {
			moves[this.activePlayer()] = [
				ChallengedTruco.CHALLENGES.Quiero,
				ChallengedTruco.CHALLENGES.NoQuiero
			];
			Array.prototype.push.apply(moves[this.activePlayer()], this.trucoResponses());
		} else {
			// No challenges are in negotiation. Can raise new ones or play normally
			if (this.table.length < 2) {
				Array.prototype.push.apply(moves[this.activePlayer()], this.envidoResponses());
			}

			if (!trucoChall || this.canUpChallenge === this.activePlayer()) {
				Array.prototype.push.apply(moves[this.activePlayer()], this.trucoResponses());
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

		if (move <= 2) {
			return SubTruco.prototype.next.call(this, moves, haps, update);
		} else {
			var that = update ? this : this.clone();
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
						that.canUpChallenge =
							trucoChall != ChallengedTruco.CHALLENGES.ValeCuatro ? activePlayer : null;
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
						// TODO: Assign score to the challenging player, game over
					} else { /* IMPOSSIBLE */ }
					break;

				case ChallengedTruco.CHALLENGES.Truco:
				case ChallengedTruco.CHALLENGES.ReTruco:
				case ChallengedTruco.CHALLENGES.ValeCuatro:
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
			that.activatePlayers(this.opponent());
			return that;
		}
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


// See __prologue__.js
	Sermat.include(exports);
	
	return exports;
}
);
//# sourceMappingURL=ludorum-game-truco.js.map