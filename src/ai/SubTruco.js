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
		var toChar = (n) => n.toString(36);
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
			baseSequence = It.product.apply(It, It.repeat(It.range(1,15), 6).toArray());
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
