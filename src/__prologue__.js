/** Package wrapper and layout.
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
