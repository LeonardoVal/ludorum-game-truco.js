// This is a copy fo similar test cases used in ludorum.
define(['creatartis-base', 'sermat', 'ludorum', 'ludorum-game-truco'],
function (base, Sermat, ludorum, ludorum_game_truco) {

	describe("ludorum-game-truco", function () {

		it("core definitions", function () {
			expect(typeof ludorum_game_truco.Truco).toBe('function');
		}); //// it "core definitions"

	}); //// describe "ludorum-game-truco"

	describe("ludorum-game-subtruco", function() {
		function theWinnerIs(hand, foot, winner) {
			var winnerIsGame = new ludorum_game_truco.ai.SubTruco([], hand, foot);

			winnerIsGame = winnerIsGame.next({'Hand': 0});
			winnerIsGame = winnerIsGame.next({'Foot': 0});

			if (!winnerIsGame.result()) {
				winnerIsGame = winnerIsGame.next({'Hand': 0});
				winnerIsGame = winnerIsGame.next({'Foot': 0});
			}


			if (!winnerIsGame.result()) {
				winnerIsGame = winnerIsGame.next({'Hand': 0});
				winnerIsGame = winnerIsGame.next({'Foot': 0});
			}

			if (winner === 'Hand') {
				expect(winnerIsGame.result()).toEqual({'Foot': -1, 'Hand': 1});
			} else {
				expect(winnerIsGame.result()).toEqual({'Foot': 1, 'Hand': -1});
			}
		}

		it("calculates possible moves", function () {
			console.log("Started it calculates possible moves");
			var game = new ludorum_game_truco.ai.SubTruco([], [2, 4, 6], [1, 3, 5]);

			expect(game.moves().Hand).toEqual([0, 1, 2]);
			// Switch to foot
			//expect(game.moves().Foot).toEqual([0, 1, 2]);

			var game2 = new ludorum_game_truco.ai.SubTruco([], [2], [1]);
			expect(game2.moves().Hand).toEqual([0]);

			// Switch to foot
			//expect(game2.moves().Foot).toEqual([0]);
		});

		it("has a winner", function() {
			console.log("Started it has a winner");
			var gameT = new ludorum_game_truco.ai.SubTruco([], [2, 4, 6], [1, 3, 5]);

			expect(gameT.result()).toBeFalsy();

			// SIN EMPATE: gana el que haya ganado 2 manos
			theWinnerIs([12, 5, 8], [6, 7, 5], 'Hand');
			theWinnerIs([2, 3, 6], [14, 1, 7], 'Foot');

			// PARDA 1ra: gana segunda
			theWinnerIs([12, 5, null], [12, 7, null], 'Foot');
			theWinnerIs([2, 3, null], [2, 1, null], 'Hand');

			// PARDA 2da: gana primera
			theWinnerIs([5, 12, null], [7, 12, null], 'Foot');
			theWinnerIs([3, 2, null], [1, 2, null], 'Hand');

			// PARDA 3ra: gana primera
			theWinnerIs([5, 8, 12], [7, 5, 12], 'Foot');
			theWinnerIs([5, 3, 12], [7, 5, 12], 'Foot');

			theWinnerIs([3, 12, 2], [1, 10, 2], 'Hand');
			theWinnerIs([3, 5, 2], [1, 10, 2], 'Hand');

			// PARDA 1ra y 2da: gana tercera
			theWinnerIs([7, 5, 10], [7, 5, 12], 'Foot');
			theWinnerIs([1, 10, 3], [1, 10, 2], 'Hand');


			// PARDA 1ra 2da y 3ra: gana la mano
			for (var i = 1; i <= 14; i++) {
				for (var j = 1; j <= 14; j++) {
					for (var k = 1; k <= 14; k++) {
						theWinnerIs([i, j, k], [i, j, k], 'Hand');
					}
				}
			}
		});

		it("can be played", function() {
			console.log("Started it can be played");
			var game = new ludorum_game_truco.ai.SubTruco([], [2, 4, 6], [1, 3, 5]);

			expect(game.table).toEqual([]);

			game = game.next({'Hand': 0});

			expect(game.cardsHand).toEqual([4, 6]);
			expect(game.cardsFoot).toEqual([1, 3, 5]);
			expect(game.table).toEqual([2]);
			expect(game.activePlayer()).toBe('Foot');
			expect(game.result()).toBeFalsy();

			game = game.next({'Foot': 2});

			expect(game.cardsHand).toEqual([4, 6]);
			expect(game.cardsFoot).toEqual([1, 3]);
			expect(game.table).toEqual([2, 5]);
			expect(game.activePlayer()).toBe('Hand');
			expect(game.result()).toBeFalsy();

			game = game.next({'Hand': 0});

			expect(game.cardsHand).toEqual([6]);
			expect(game.cardsFoot).toEqual([1, 3]);
			expect(game.table).toEqual([2, 5, 4]);
			expect(game.activePlayer()).toBe('Foot');
			expect(game.result()).toBeFalsy();

			game = game.next({'Foot': 1});

			expect(game.cardsHand).toEqual([6]);
			expect(game.cardsFoot).toEqual([1]);
			expect(game.table).toEqual([2, 5, 4, 3]);
			expect(game.activePlayer()).toBe('Hand');
			expect(game.result()).toBeFalsy();

			game = game.next({'Hand': 0});

			expect(game.cardsHand).toEqual([]);
			expect(game.cardsFoot).toEqual([1]);
			expect(game.table).toEqual([2, 5, 4, 3, 6]);
			expect(game.activePlayer()).toBe('Foot');
			expect(game.result()).toBeFalsy();


			game = game.next({'Foot': 0});
			expect(game.cardsHand).toEqual([]);
			expect(game.cardsFoot).toEqual([]);
			expect(game.table).toEqual([2, 5, 4, 3, 6, 1]);
			expect(game.activePlayer()).toBe('Hand');
			expect(game.result()).toEqual({'Foot': -1, 'Hand': 1});



			var game2 = new ludorum_game_truco.ai.SubTruco([], [6, 7, 5], [12, 5, 8]);

			expect(game2.table).toEqual([]);

			game2 = game2.next({'Hand': 0});

			expect(game2.cardsHand).toEqual([7, 5]);
			expect(game2.cardsFoot).toEqual([12, 5, 8]);
			expect(game2.table).toEqual([6]);
			expect(game2.activePlayer()).toBe('Foot');
			expect(game2.result()).toBeFalsy();

			game2 = game2.next({'Foot': 1});
			expect(game2.cardsHand).toEqual([7, 5]);
			expect(game2.cardsFoot).toEqual([12, 8]);
			expect(game2.table).toEqual([6, 5]);
			expect(game2.activePlayer()).toBe('Hand');
			expect(game2.result()).toBeFalsy();

			game2 = game2.next({'Hand': 0});
			expect(game2.cardsHand).toEqual([5]);
			expect(game2.cardsFoot).toEqual([12, 8]);
			expect(game2.table).toEqual([6, 5, 7]);
			expect(game2.activePlayer()).toBe('Foot');
			expect(game2.result()).toBeFalsy();

			game2 = game2.next({'Foot': 0});
			expect(game2.cardsHand).toEqual([5]);
			expect(game2.cardsFoot).toEqual([8]);
			expect(game2.table).toEqual([6, 5, 7, 12]);
			expect(game2.activePlayer()).toBe('Hand');
			expect(game2.result()).toBeFalsy();


			game2 = game2.next({'Hand': 0});
			expect(game2.cardsHand).toEqual([]);
			expect(game2.cardsFoot).toEqual([8]);
			expect(game2.table).toEqual([6, 5, 7, 12, 5]);
			expect(game2.activePlayer()).toBe('Foot');
			expect(game2.result()).toBeFalsy();

			game2 = game2.next({'Foot': 0});
			expect(game2.cardsHand).toEqual([]);
			expect(game2.cardsFoot).toEqual([]);
			expect(game2.table).toEqual([6, 5, 7, 12, 5, 8]);
			expect(game2.activePlayer()).toBe('Hand');
			expect(game2.result()).toEqual({'Foot': 1, 'Hand': -1});
		});

		it("can be solved by MiniMax", function () {
			console.log("Testing time!");
			var game = new ludorum_game_truco.ai.SubTruco([], [12, 5, 8], [6, 7, 5]);
			var t0 = performance.now();
			ludorum.players.MiniMaxPlayer.solution(game, {});
			var t1 = performance.now();

			console.log("It took: " + (t1 - t0) + " milliseconds");
		});

	});

	describe("ludorum-game-challengedtruco", function() {
		var chall_truco = ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.Truco;
		var chall_retruco = ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.ReTruco;
		var chall_valecuatro = ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.ValeCuatro;
		var chall_quiero = ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.Quiero;
		var chall_noquiero = ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.NoQuiero;



		it("has challenges as possible moves", function() {
			var game = new ludorum_game_truco.ai.ChallengedTruco([], [2, 4, 6], [1, 3, 5]);

			expect(game.moves().Hand).toEqual([0, 1, 2,
				ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.FaltaEnvido,
				ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.RealEnvido,
				ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.Envido,
				chall_truco,
			]);
			expect(game.moves().Foot).toBeFalsy();
			// Switch to foot
			//expect(game.moves().Foot).toEqual([0, 1, 2]);

			var game2 = new ludorum_game_truco.ai.ChallengedTruco([], [2], [1]);
			expect(game2.moves().Hand).toEqual([0,
				ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.FaltaEnvido,
				ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.RealEnvido,
				ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.Envido,
				chall_truco,
			]);
		});
		
		it("answers to truco challenges correctly", function() {
			var game = new ludorum_game_truco.ai.ChallengedTruco([], [2, 4, 6], [1, 3, 5]);
			
			// El jugador mano desafía al truco
			game = game.next({'Hand': chall_truco});
			expect(game.cardsHand).toEqual([2, 4, 6]);
			expect(game.cardsFoot).toEqual([1, 3, 5]);
			expect(game.table).toEqual([]);
			expect(game.activePlayer()).toBe('Foot');
			expect(game.result()).toBeFalsy();

			// TODO: Puede cantarse envido ante de contestar al 'Truco'
			expect(game.moves().Foot).toEqual([
				chall_quiero, 
				chall_noquiero, 
				chall_retruco,
			]);


			// Caso el pie rechace el desafio la partida termina
			gameNoQuerido = game.next({'Foot': chall_noquiero});
			expect(gameNoQuerido.result()).toEqual({'Foot': -1, 'Hand': 1});


			// De querer el truco el juego sigue pero solo el pie (quien aceptó)
			// puede aumentar la apuesta (re truco)
			gameQuerido = game.next({'Foot': chall_quiero});
			expect(gameQuerido.cardsHand).toEqual([2, 4, 6]);
			expect(gameQuerido.cardsFoot).toEqual([1, 3, 5]);
			expect(gameQuerido.table).toEqual([]);

			// El mano no puede aumentar la apuesta del truco y ya no puede cantar envido
			expect(gameQuerido.activePlayer()).toBe('Hand');
			expect(gameQuerido.result()).toBeFalsy();
			expect(gameQuerido.moves().Hand).toEqual([0, 1, 2,
				ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.FaltaEnvido,
				ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.RealEnvido,
				ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.Envido,
			]);

			gameQuerido = gameQuerido.next({'Hand': 0});

			// El jugador con el quiero puede aumentar la apuesta cantando retruco
			expect(gameQuerido.activePlayer()).toBe('Foot');
			expect(gameQuerido.moves().Foot).toEqual([0, 1, 2,
				ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.FaltaEnvido,
				ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.RealEnvido,
				ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.Envido,
				chall_retruco,
			]);


			// El jugador puede contestar al desafío aumentando la apuesta (cantando retruco sin pasar por el quiero)
			// En este caso el mano debe contestar al desafío.
			gameRetruco = game.next({'Foot': chall_retruco}); 
			expect(gameRetruco.activePlayer()).toBe('Hand');
			expect(gameRetruco.result()).toBeFalsy();
			expect(gameRetruco.moves().Hand).toEqual([chall_quiero, chall_noquiero, chall_valecuatro]);

			// TODO: El turno debe volvera  quien inicia la cadena.
			// e.g. Mano: truco, Pie: retruco (al llegar a un `quiero` será el turno del mano)
			gameRetruco = gameRetruco.next({'Hand': chall_quiero});
			expect(gameRetruco.activePlayer()).toBe('Hand'); 
			// TODO: Esta parida vale 3 puntos
			expect(gameRetruco.result()).toBeFalsy();
			expect(gameRetruco.moves().Hand).toEqual([0, 1, 2, chall_valecuatro]);
		});
	});

}); //// define.
