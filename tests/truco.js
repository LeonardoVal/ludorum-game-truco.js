require(['require-config'], function (init) { "use strict";
init(['ludorum', 'creatartis-base', 'sermat', 'playtester', 'ludorum-game-truco'], function (ludorum, base, Sermat, PlayTesterApp, ludorum_game_truco) {
	var CheckerboardFromString = ludorum.utils.CheckerboardFromString,
	    CHALLENGES = ludorum_game_truco.ai.ChallengedTruco.CHALLENGES,
	    CARDS = ludorum_game_truco.ai.SubTruco.CARDS;

	/** Custom HTML interface for TicTacToe.
	*/
	var TrucoHTMLInterface = base.declare(ludorum.players.UserInterface.BasicHTMLInterface, {
		constructor: function TrucoHTMLInterface() {
			ludorum.players.UserInterface.BasicHTMLInterface.call(this, {
				document: document,
				container: document.getElementById('board')
			});
		},

		/** Each of the board's squares looks are customized via CSS,
		*/
		classNames: {
			'active': 'activeCard',
			'table': 'table',
			'player': 'player',
			'challenge': 'activeCard challenge',
			'nochall': 'challenge',
			'state': 'state challenge',
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
			console.log(moves);
			console.log(CHALLENGES);

		function challMove(row, column, data, moveList, move, symbol) {
			if (data.coord[0] !== row || data.coord[1] !== column) {
				return;
			}
			data.innerHTML = symbol;
			data.className = classNames.nochall;
			if (moveList.includes(move)) {
				data.className = classNames.challenge;
				data.move = move;
				data.activePlayer = activePlayer;
				data.onclick = ui.perform.bind(ui, data.move, activePlayer);
			}
		}

			moves = moves && moves[activePlayer] && moves[activePlayer].length > 0;
			(new CheckerboardFromString(4, 6))
				.renderAsHTMLTable(ui.document, ui.container, function (data) {
					if (data.coord[1] < 3) {
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
							if (((data.coord[0] === row.hand && activePlayer === 'Hand') || (data.coord[0] === row.foot && activePlayer === 'Foot')) &&
								game.moves()[activePlayer].includes(data.coord[1])) {
								data.className = classNames.active;
								data.move = data.coord[1];
								data.activePlayer = activePlayer;
								data.onclick = ui.perform.bind(ui, data.move, activePlayer);
							}
						}
					} else if (data.coord[1] < 5) {
						data.innerHTML = '&nbsp;';
						var moveList = (game.moves() && game.moves()[activePlayer]) || [];
						challMove(3, 3, data, moveList, CHALLENGES.Quiero, 'Qu');
						challMove(3, 4, data, moveList, CHALLENGES.NoQuiero, 'NQ');
						challMove(2, 3, data, moveList, CHALLENGES.Truco, 'Tr');
						challMove(2, 4, data, moveList, CHALLENGES.ReTruco, 'RT');
						challMove(1, 3, data, moveList, CHALLENGES.ValeCuatro, 'V4');
					} else {
						data.innerHTML = '&nbsp;';
						switch (data.coord[0]) {
							case 3:
								data.innerHTML = '<span class="tag">State:</span><br/>' + trucoToState(game.trucoState);
								data.className = classNames.state;
								break;
							case 2:
								data.innerHTML = '<span class="tag">Posed:</span><br/>' + trucoToState(game.trucoPosed);
								data.className = classNames.state;
								break;
						}
					}
				});
		}
	});

	function trucoToState(challenge) {
		switch (challenge) {
			case CHALLENGES.Truco:
				return 'Tr';
			case CHALLENGES.ReTruco:
				return 'RT';
			case CHALLENGES.ValeCuatro:
				return 'V4';
			default:
				return '&nbsp;';
		}
	}


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
