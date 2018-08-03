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
        moves[i] = i;
    }
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
	name: 'Truco',

	/** TODO
	*/
	constructor: function SubTruco(activePlayer, cardsHand, cardsFoot) {
		Game.call(this, activePlayer);

		this.table = [];
		this.cardsHand = cardsHand;
		this.cardsFoot = cardsFoot;

		this.winner = null;

		//Posicion 0: puntaje de Mano, posicion 1: puntaje del Pie
		this.score = [0, 0];

		this.result_parcial = [];
		//Si gana el mano, se pone 1, si gana el pie -1

		//resultado_parcial[3]=={"M","P","E"};

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

	/**
	 *
	 * e.g. { "Hand": {player: "Hand", }}
	*/
	next: function next(moves, haps, update) {
		var move = moves[this.activePlayer()];
		var cartaATirar;

		if (this.activePlayer() === "Hand") {
			cartaATirar = this.cardsHand[move];
			this.cardsHand.splice(move, 1);
			this.mesa.push(cartaATirar);
			// Quitar de la mano del jugador una carta y ponerla en la mesa

		} else {
			cartaATirar = this.cardsFoot[move];
			this.cardsFoot.splice(move, 1);
			this.mesa.push(cartaATirar);

			//Comparar cartas en la mesa con la del mano, y ver quien gano la jugada parcial
			switch (cardsFoot.length) {
				case 2:
					result_parcial[0] = this.mesa[0] > this.mesa[1] ? 1 : -1;
					break;
				case 1:
					result_parcial[1] = this.mesa[2] > this.mesa[3] ? 1 : -1;
					break;
				case 0:
					result_parcial[2] = this.mesa[4] > this.mesa[5] ? 1 : -1;
					break;
			}

			this.winner = this.partialWinner();
		}


		return null;
	},

	partialWinner: function partialWinner() {
		// SIN EMPATE: gana el que haya ganado 2 manos
		// PARDA 1ra: gana segunda
		// PARDA 2da: gana primera
		// PARDA 3ra: gana primera
		// PARDA 1ra y 2da: gana tercera
		// PARDA 1ra 2da y 3ra: gana la mano

		if (result_parcial.length > 1) {
			if (result_parcial.length == 2) {
				if (result_parcial == [1, 1] || result_parcial == [0, 1] || result_parcial == [1, 0]) {
					return "Hand";
				} else if (result_parcial == [-1, -1] || result_parcial == [0, -1] || result_parcial == [-1, 0]) {
					return "Foot";
				}
			} else {
				if (result_parcial == [1, -1, 1] || result_parcial == [1, -1, 0] || result_parcial == [0, 0, 0] || result_parcial == [0, 0, 1]) {
					return "Hand";
				} else if (result_parcial == [-1, 1, -1] || result_parcial == [-1, 1, 0] || result_parcial == [0, 0, -1]) {
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
//# sourceMappingURL=ludorum-game-truco.js.map