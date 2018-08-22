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

// TODO: Calcular tiempo que toma MiniMaxPlayer NO ALPHA BETA

var SubTruco = exports.ai.SubTruco = declare(Game, {
	name: 'Truco',

	/** TODO
	*/
	constructor: function SubTruco(activePlayer, cardsHand, cardsFoot) {
		Game.call(this, activePlayer);

		this.table = [];
		this.cardsHand = cardsHand;
		this.cardsFoot = cardsFoot;

		this.winner = null;

		// 1 for the Hand, -1 for Foot
		this.result_parcial = [];
	},

	/** The players' roles in a Truco match are `"Hand"` (_Mano_) and `"Foot"` (_Pie_).
	*/
	players: ["Hand", "Foot"],

	// ## Game logic ###############################################################################

	/** TODO
	 * Devuelve un objeto de los movimientos posibles para los jugadores activo
	 *
	 * En este caso da las cartas que pueden ser tiradas.
	 *
	 * e.g. { "Hand": [{player: "Hand", card: 0}, {player: "Hand", card: 1}]}
	*/
	moves: function moves() { // { player: [move]}
		if (!this.result()) {
			var moves = {};
			if (this.activePlayer() === "Hand") {
				moves[this.activePlayer()] = generateMoves(this.cardsHand);
			} else {
				moves[this.activePlayer()] = generateMoves(this.cardsFoot);
			}
			return moves;
		} else {
			return null;
		}
	},

	/** TODO
	*/
	result: function result() {
		if (this.winner) {
			return this.victory(this.winner);
		} else {
			return null;
		}
	},

	clone: function clone() {
		var that = new SubTruco(this.activePlayer(), this.cardsHand.slice(), this.cardsFoot.slice());
		that.table = this.table.slice();
		that.winner = this.winner;
		that.result_parcial = this.result_parcial.slice();
		return that;
	},

	/** TODO
	*/
	next: function next(moves, haps, update) {
		var that = update ? this : this.clone();
		var move = moves[this.activePlayer()];
		var cartaATirar;

		if (that.activePlayer() === "Hand") {
			cartaATirar = that.cardsHand[move];
			that.cardsHand.splice(move, 1);
			that.table.push(cartaATirar);
			// Quitar de la mano del jugador una carta y ponerla en la mesa

		} else {
			cartaATirar = that.cardsFoot[move];
			that.cardsFoot.splice(move, 1);
			that.table.push(cartaATirar);

			//Comparar cartas en la mesa con la del mano, y ver quien gano la jugada parcial
			switch (that.cardsFoot.length) {
				case 2:
					that.result_parcial[0] = that.table[0] > that.table[1] ? 1 : -1;
					break;
				case 1:
					that.result_parcial[1] = that.table[2] > that.table[3] ? 1 : -1;
					break;
				case 0:
					that.result_parcial[2] = that.table[4] > that.table[5] ? 1 : -1;
					break;
			}

			that.winner = that.partialWinner();
		}

		var opponent = that.activePlayer() === 'Hand' ? 'Foot' : 'Hand';
		that.activatePlayers(opponent);


		return that;
	},

	partialWinner: function partialWinner() {
		// SIN EMPATE: gana el que haya ganado 2 manos
		// PARDA 1ra: gana segunda
		// PARDA 2da: gana primera
		// PARDA 3ra: gana primera
		// PARDA 1ra y 2da: gana tercera
		// PARDA 1ra 2da y 3ra: gana la mano

		var par = this.result_parcial;


		if (par.length > 1) {
			if (par.length == 2) {
				if (arrEq(par, [1, 1]) || arrEq(par, [0, 1]) || arrEq(par, [1, 0])) {
					console.log("Into A");
					return "Hand";
				} else if (arrEq(par, [-1, -1]) || arrEq(par, [0, -1]) || arrEq(par, [-1, 0])) {
					console.log("Into B");
					return "Foot";
				}
			} else {
				if (arrEq(par, [1, -1, 1]) || arrEq(par, [1, -1, 0]) || arrEq(par, [0, 0, 0]) || arrEq(par, [0, 0, 1]) || arrEq(par, [-1, 1, 1])) {
					console.log("Into C");
					return "Hand";
				} else if (arrEq(par, [-1, 1, -1]) || arrEq(par, [-1, 1, 0]) || arrEq(par, [0, 0, -1])) {
					console.log("Into D");
					return "Foot";
				}
			}
		}

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