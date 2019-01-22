require(['require-config'], function (init) { "use strict";
init(['ludorum', 'creatartis-base', 'sermat', 'playtester', 'ludorum-game-truco'], function (ludorum, base, Sermat, PlayTesterApp, ludorum_game_truco) {
	var CheckerboardFromString = ludorum.utils.CheckerboardFromString,
	    CARDS = ludorum_game_truco.ai.SubTruco.CARDS;

	/** Custom HTML interface for TicTacToe.
	*/
	var TrucoHTMLInterface = base.declare(ludorum.players.UserInterface.BasicHTMLInterface, {
		constructor: function TrucoHTMLInterface() {
			ludorum.players.UserInterface.BasicHTMLInterface.call(this, {
				document: document, container: document.getElementById('board')
			});
		},

		/** Each of the board's squares looks are customized via CSS.
		*/
		classNames: {
			'active': "activeCard",
			'table': 'table',
			'player': 'player',
		},

		uiRow: {
			'hand': 3,
			'foot': 0,
			'tableH': 2,
			'tableF': 1
		},

		display: function display(game) {
			var ui = this,
				activePlayer = game.activePlayer(),
				moves = game.moves(),
				table = game.realTable,
				cardsHand = game.realHand,
				cardsFoot = game.realFoot,
				classNames = this.classNames,
				row = this.uiRow,
				squareHTML = this.squareHTML;
			this.container.innerHTML = ''; // empty the board's DOM.
			moves = moves && moves[activePlayer] && moves[activePlayer].length > 0;
			(new CheckerboardFromString(4, 3))
				.renderAsHTMLTable(ui.document, ui.container, function (data) {
					switch (data.coord[0]) {
						case row.tableH:
							// Shows hand's cards on table
							data.card = table[data.coord[1] * 2 ] || 0;
							data.className = classNames.table;
							break;
						case row.tableF:
							// Shows foots's cards on table
							data.card = table[data.coord[1] * 2 + 1] || 0;
							data.className = classNames.table;
							break;
						case row.hand:
							data.card = cardsHand[data.coord[1]] || 0;
							data.className = classNames.player;
							break;
						case row.foot:
							data.card = cardsFoot[data.coord[1]] || 0;
							data.className = classNames.player;
							break;
						default:
							break;
					}
					data.innerHTML = data.card || '&nbsp;';
					if (moves) {
						if ((data.coord[0] === row.hand && activePlayer === 'Hand') || (data.coord[0] === row.foot && activePlayer === 'Foot')) {
							data.className = classNames.active;
							data.move = data.coord[1];
							data.activePlayer = activePlayer;
							data.onclick = ui.perform.bind(ui, data.move, activePlayer);
						}
					}
				});
		}
	});

	/** PlayTesterApp initialization. ************************************************************/
	var APP = new PlayTesterApp(new ludorum_game_truco.ai.ChallengedTruco([], [2, 4, 6], [1, 3, 5]), new TrucoHTMLInterface(),
		{ bar: document.getElementsByTagName('footer')[0] });
	base.global.APP = APP;
	APP.playerUI("You")
		.playerRandom()
		.selects(['playerHand', 'playerFoot'])
		.button('resetButton', document.getElementById('reset'), APP.reset.bind(APP))
		.reset();

	}); // init()
}); // require().
