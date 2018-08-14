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
		var that = new SubTruco(this.activePlayer, this.cardsHand.slice(0), this.cardsFoot.slice(0));
		that.table = this.table.slice(0);
		that.winner = this.winner;
		that.result_parcial = this.result_parcial.slice(0);
		return that;
	},

	/** TODO
	*/
	next: function next(moves, haps, update) {
		var that = update ? this : this.clone();
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

		activePlayer = activePlayer === 'Hand' ? 'Foot' : 'Hand';


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