// This is a copy fo similar test cases used in ludorum.
define(['creatartis-base', 'sermat', 'ludorum', 'ludorum-game-truco'],
function (base, Sermat, ludorum, ludorum_game_truco) {

	describe("ludorum-game-truco", function () {

		it("core definitions", function () {
			expect(typeof ludorum_game_truco.Truco).toBe('function');
		}); //// it "core definitions"

	}); //// describe "ludorum-game-truco"

	function winnerWithScore(game, handScore) {
		var winnerIsGame = game;

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

		expect(winnerIsGame.result()).toEqual({'Foot': -handScore, 'Hand': handScore});
		expect(winnerIsGame.moves()).toEqual(null);
	}
	function theWinnerIs(hand, foot, winner) {
		var winnerIsGame = new ludorum_game_truco.ai.SubTruco([], hand, foot);

		winnerWithScore(winnerIsGame, winner === 'Hand' ? 1 : -1);
	}
	describe("ludorum-game-subtruco", function() {

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
		var chall_envido = ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.Envido;
		var chall_realenvido = ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.RealEnvido;
		var chall_faltaenvido = ludorum_game_truco.ai.ChallengedTruco.CHALLENGES.FaltaEnvido;



		it("has challenges as possible moves", function() {
			var game = new ludorum_game_truco.ai.ChallengedTruco([], [2, 4, 6], [1, 3, 5]);

			expect(game.moves().Hand).toEqual([0, 1, 2,
				chall_faltaenvido,
				chall_realenvido,
				chall_envido,
				chall_truco,
			]);
			expect(game.moves().Foot).toBeFalsy();
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

			expect(game.moves().Foot).toEqual([
				chall_quiero, 
				chall_noquiero, 
				chall_faltaenvido,
				chall_realenvido,
				chall_envido,
				chall_retruco,
			]);


			// Caso el pie rechace el desafio la partida termina
			gameNoQuerido = game.next({'Foot': chall_noquiero});
			expect(gameNoQuerido.result()).toEqual({'Foot': -1, 'Hand': 1});
			expect(gameNoQuerido.moves()).toEqual(null);


			// De querer el truco el juego sigue pero solo el pie (quien aceptó)
			// puede aumentar la apuesta (re truco)
			gameQuerido = game.next({'Foot': chall_quiero});
			expect(gameQuerido.cardsHand).toEqual([2, 4, 6]);
			expect(gameQuerido.cardsFoot).toEqual([1, 3, 5]);
			expect(gameQuerido.table).toEqual([]);

			// El mano no puede aumentar la apuesta del truco
			expect(gameQuerido.activePlayer()).toBe('Hand');
			expect(gameQuerido.result()).toBeFalsy();
			expect(gameQuerido.moves().Hand).toEqual([0, 1, 2]);

			gameQuerido = gameQuerido.next({'Hand': 0});

			// El jugador con el quiero puede aumentar la apuesta cantando retruco
			expect(gameQuerido.activePlayer()).toBe('Foot');
			expect(gameQuerido.moves().Foot).toEqual([0, 1, 2,
				chall_retruco,
			]);

			expect(gameQuerido.next({'Foot': 0}).moves().Hand).toEqual([0, 1]);

			// El jugador puede contestar al desafío aumentando la apuesta (cantando retruco sin pasar por el quiero)
			// En este caso el mano debe contestar al desafío.
			gameRetruco = game.next({'Foot': chall_retruco}); 
			expect(gameRetruco.activePlayer()).toBe('Hand');
			expect(gameRetruco.result()).toBeFalsy();
			expect(gameRetruco.moves().Hand).toEqual([
				chall_quiero,
				chall_noquiero,
				chall_valecuatro]);

			gameRetruco = gameRetruco.next({'Hand': chall_quiero});
			expect(gameRetruco.activePlayer()).toBe('Hand'); 
			expect(gameRetruco.result()).toBeFalsy();
			expect(gameRetruco.moves().Hand).toEqual([0, 1, 2,
				chall_valecuatro,
			]);

			gameRetruco = gameRetruco.next({'Hand': 0});
			expect(gameRetruco.activePlayer()).toBe('Foot');
			expect(gameRetruco.result()).toBeFalsy();
			expect(gameRetruco.moves().Foot).toEqual([0, 1, 2]);

			gameRetruco = gameRetruco.next({'Foot': 1});
			expect(gameRetruco.activePlayer()).toBe('Hand');
			expect(gameRetruco.result()).toBeFalsy();
			expect(gameRetruco.moves().Hand).toEqual([0, 1, chall_valecuatro]);

			gameRetruco = gameRetruco.next({'Hand': chall_valecuatro});
			expect(gameRetruco.activePlayer()).toBe('Foot');
			expect(gameRetruco.result()).toBeFalsy();
			expect(gameRetruco.moves().Foot).toEqual([chall_quiero, chall_noquiero]);

			var gameValeCuatroNoQuiero = gameRetruco.next({'Foot': chall_noquiero});
			expect(gameValeCuatroNoQuiero.result()).toEqual({'Foot': -3, 'Hand': 3});
			expect(gameValeCuatroNoQuiero.moves()).toEqual(null);

			var gameValeCuatroQuiero = gameRetruco.next({'Foot': chall_quiero});
			expect(gameValeCuatroQuiero.activePlayer()).toBe('Hand');
			expect(gameValeCuatroQuiero.result()).toBeFalsy();
			expect(gameValeCuatroQuiero.moves().Hand).toEqual([0, 1]);
		});

		it("ends with a score reflecting raised challenges", function() {
			var game = new ludorum_game_truco.ai.ChallengedTruco([], [12, 5, 8], [6, 7, 5]);
			game = game.next({'Hand': chall_truco});
			expect(game.next({'Foot': chall_noquiero}).result()).toEqual({'Foot': -1, 'Hand': 1});
			expect(game.next({'Foot': chall_noquiero}).moves()).toEqual(null);

			winnerWithScore(game.next({'Foot': chall_quiero}), 2);

			game = game.next({'Foot': chall_retruco});
			expect(game.next({'Hand': chall_noquiero}).result()).toEqual({'Foot': 2, 'Hand': -2});
			expect(game.next({'Hand': chall_noquiero}).moves()).toEqual(null);

			winnerWithScore(game.next({'Hand': chall_quiero}), 3);

			game = game.next({'Hand': chall_valecuatro});
			expect(game.next({'Foot': chall_noquiero}).result()).toEqual({'Foot': -3, 'Hand': 3});
			expect(game.next({'Foot': chall_noquiero}).moves()).toEqual(null);

			winnerWithScore(game.next({'Foot': chall_quiero}), 4);
		});

		it("answers to envido challenges correctly", function() {
			var game = new ludorum_game_truco.ai.ChallengedTruco([], [12, 5, 8], [6, 7, 5]);

			expect(game.cardsHand).toEqual([12, 5, 8]);
			expect(game.cardsFoot).toEqual([6, 7, 5]);
			expect(game.table).toEqual([]);
			expect(game.activePlayer()).toBe('Hand');
			expect(game.result()).toBeFalsy();
			expect(game.moves().Hand).toEqual([0, 1, 2,
				chall_faltaenvido,
				chall_realenvido,
				chall_envido,
				chall_truco,
			]);

			var gameEnvido = game.next({'Hand': chall_envido});
			expect(gameEnvido.cardsHand).toEqual([12, 5, 8]);
			expect(gameEnvido.cardsFoot).toEqual([6, 7, 5]);
			expect(gameEnvido.table).toEqual([]);
			expect(gameEnvido.activePlayer()).toBe('Foot');
			expect(gameEnvido.result()).toBeFalsy();
			expect(gameEnvido.moves().Foot).toEqual([
				chall_quiero,
				chall_noquiero,
				chall_faltaenvido,
				chall_realenvido,
				chall_envido
			]);

			var gameEnvidoEnvido = gameEnvido.next({'Foot': chall_envido});
			expect(gameEnvidoEnvido.activePlayer()).toBe('Hand');
			expect(gameEnvidoEnvido.result()).toBeFalsy();
			expect(gameEnvidoEnvido.moves().Hand).toEqual([
				chall_quiero,
				chall_noquiero,
				chall_faltaenvido,
				chall_realenvido,
			]);

			var gameEnvidoEnvidoReal = gameEnvidoEnvido.next({'Hand': chall_realenvido});
			expect(gameEnvidoEnvidoReal.activePlayer()).toBe('Foot');
			expect(gameEnvidoEnvidoReal.result()).toBeFalsy();
			expect(gameEnvidoEnvidoReal.moves().Foot).toEqual([
				chall_quiero,
				chall_noquiero,
				chall_faltaenvido
			]);

			var gameEnvidoEnvidoRealFalta = gameEnvidoEnvidoReal.next({'Foot': chall_faltaenvido});
			expect(gameEnvidoEnvidoRealFalta.activePlayer()).toBe('Hand');
			expect(gameEnvidoEnvidoRealFalta.result()).toBeFalsy();
			expect(gameEnvidoEnvidoRealFalta.moves().Hand).toEqual([
				chall_quiero,
				chall_noquiero,
			]);

			var gameEnvidoEnvidoFalta = gameEnvidoEnvido.next({'Hand': chall_faltaenvido});
			expect(gameEnvidoEnvidoFalta.activePlayer()).toBe('Foot');
			expect(gameEnvidoEnvidoFalta.result()).toBeFalsy();
			expect(gameEnvidoEnvidoFalta.moves().Foot).toEqual([
				chall_quiero,
				chall_noquiero,
			]);

			var gameEnvidoReal = gameEnvido.next({'Foot': chall_realenvido});
			expect(gameEnvidoReal.activePlayer()).toBe('Hand');
			expect(gameEnvidoReal.result()).toBeFalsy();
			expect(gameEnvidoReal.moves().Hand).toEqual([
				chall_quiero,
				chall_noquiero,
				chall_faltaenvido
			]);

			var gameEnvidoRealFalta = gameEnvidoReal.next({'Hand': chall_faltaenvido});
			expect(gameEnvidoRealFalta.activePlayer()).toBe('Foot');
			expect(gameEnvidoRealFalta.result()).toBeFalsy();
			expect(gameEnvidoRealFalta.moves().Foot).toEqual([
				chall_quiero,
				chall_noquiero,
			]);

			var gameEnvidoFalta = gameEnvido.next({'Foot': chall_faltaenvido});
			expect(gameEnvidoFalta.activePlayer()).toBe('Hand');
			expect(gameEnvidoFalta.result()).toBeFalsy();
			expect(gameEnvidoFalta.moves().Hand).toEqual([
				chall_quiero,
				chall_noquiero,
			]);

			var gameReal = game.next({'Hand': chall_realenvido});
			expect(gameReal.activePlayer()).toBe('Foot');
			expect(gameReal.result()).toBeFalsy();
			expect(gameReal.moves().Foot).toEqual([
				chall_quiero,
				chall_noquiero,
				chall_faltaenvido
			]);

			var gameRealFalta = gameReal.next({'Foot': chall_faltaenvido});
			expect(gameRealFalta.activePlayer()).toBe('Hand');
			expect(gameRealFalta.result()).toBeFalsy();
			expect(gameRealFalta.moves().Hand).toEqual([
				chall_quiero,
				chall_noquiero,
			]);

			var gameFalta = game.next({'Hand': chall_faltaenvido});
			expect(gameFalta.activePlayer()).toBe('Foot');
			expect(gameFalta.result()).toBeFalsy();
			expect(gameFalta.moves().Foot).toEqual([
				chall_quiero,
				chall_noquiero,
			]);
		});

		it("does not allow calling `envido` after calling `truco` (for each player)", function() {
			var game = new ludorum_game_truco.ai.ChallengedTruco([], [12, 5, 8], [6, 7, 5]);

			expect(game.cardsHand).toEqual([12, 5, 8]);
			expect(game.cardsFoot).toEqual([6, 7, 5]);
			expect(game.table).toEqual([]);
			expect(game.activePlayer()).toBe('Hand');
			expect(game.result()).toBeFalsy();
			expect(game.moves().Hand).toEqual([0, 1, 2,
				chall_faltaenvido,
				chall_realenvido,
				chall_envido,
				chall_truco,
			]);

			var game2 = game.next({'Hand': 0});
			expect(game2.cardsHand).toEqual([5, 8]);
			expect(game2.cardsFoot).toEqual([6, 7, 5]);
			expect(game2.table).toEqual([12]);
			expect(game2.activePlayer()).toBe('Foot');
			expect(game2.result()).toBeFalsy();
			expect(game2.moves().Foot).toEqual([0, 1, 2,
				chall_faltaenvido,
				chall_realenvido,
				chall_envido,
				chall_truco
			]);
			game2 = game2.next({'Foot': chall_truco});
			expect(game2.cardsHand).toEqual([5, 8]);
			expect(game2.cardsFoot).toEqual([6, 7, 5]);
			expect(game2.table).toEqual([12]);
			expect(game2.activePlayer()).toBe('Hand');
			expect(game2.result()).toBeFalsy();
			expect(game2.moves().Hand).toEqual([
				chall_quiero,
				chall_noquiero,
				chall_retruco,
			]);

			game2 = game2.next({'Hand': chall_quiero});
			expect(game2.cardsHand).toEqual([5, 8]);
			expect(game2.cardsFoot).toEqual([6, 7, 5]);
			expect(game2.table).toEqual([12]);
			expect(game2.activePlayer()).toBe('Foot');
			expect(game2.result()).toBeFalsy();
			expect(game2.moves().Foot).toEqual([0, 1, 2]);


			game = game.next({'Hand': chall_truco});
			expect(game.cardsHand).toEqual([12, 5, 8]);
			expect(game.cardsFoot).toEqual([6, 7, 5]);
			expect(game.table).toEqual([]);
			expect(game.activePlayer()).toBe('Foot');
			expect(game.result()).toBeFalsy();
			expect(game.moves().Foot).toEqual([
				chall_quiero,
				chall_noquiero,
				chall_faltaenvido,
				chall_realenvido,
				chall_envido,
				chall_retruco,
			]);

			game = game.next({'Foot': chall_quiero});
			expect(game.cardsHand).toEqual([12, 5, 8]);
			expect(game.cardsFoot).toEqual([6, 7, 5]);
			expect(game.table).toEqual([]);
			expect(game.activePlayer()).toBe('Hand');
			expect(game.result()).toBeFalsy();
			expect(game.moves().Hand).toEqual([0, 1, 2]);
		});

		it("answers to envido challenges correctly when foot starts", function() {
			var game = new ludorum_game_truco.ai.ChallengedTruco([], [12, 5, 8], [6, 7, 5]);
			game = game.next({'Hand': 0});

			expect(game.cardsHand).toEqual([5, 8]);
			expect(game.cardsFoot).toEqual([6, 7, 5]);
			expect(game.table).toEqual([12,]);
			expect(game.activePlayer()).toBe('Foot');
			expect(game.result()).toBeFalsy();
			expect(game.moves().Foot).toEqual([0, 1, 2,
				chall_faltaenvido,
				chall_realenvido,
				chall_envido,
				chall_truco,
			]);

			var gameEnvido = game.next({'Foot': chall_envido});
			expect(gameEnvido.cardsHand).toEqual([5, 8]);
			expect(gameEnvido.cardsFoot).toEqual([6, 7, 5]);
			expect(gameEnvido.table).toEqual([12]);
			expect(gameEnvido.activePlayer()).toBe('Hand');
			expect(gameEnvido.result()).toBeFalsy();
			expect(gameEnvido.moves().Hand).toEqual([
				chall_quiero,
				chall_noquiero,
				chall_faltaenvido,
				chall_realenvido,
				chall_envido
			]);

			var gameEnvidoEnvido = gameEnvido.next({'Hand': chall_envido});
			expect(gameEnvidoEnvido.activePlayer()).toBe('Foot');
			expect(gameEnvidoEnvido.result()).toBeFalsy();
			expect(gameEnvidoEnvido.moves().Foot).toEqual([
				chall_quiero,
				chall_noquiero,
				chall_faltaenvido,
				chall_realenvido,
			]);

			var gameEnvidoEnvidoReal = gameEnvidoEnvido.next({'Foot': chall_realenvido});
			expect(gameEnvidoEnvidoReal.activePlayer()).toBe('Hand');
			expect(gameEnvidoEnvidoReal.result()).toBeFalsy();
			expect(gameEnvidoEnvidoReal.moves().Hand).toEqual([
				chall_quiero,
				chall_noquiero,
				chall_faltaenvido
			]);

			var gameEnvidoEnvidoRealFalta = gameEnvidoEnvidoReal.next({'Hand': chall_faltaenvido});
			expect(gameEnvidoEnvidoRealFalta.activePlayer()).toBe('Foot');
			expect(gameEnvidoEnvidoRealFalta.result()).toBeFalsy();
			expect(gameEnvidoEnvidoRealFalta.moves().Foot).toEqual([
				chall_quiero,
				chall_noquiero,
			]);

			var gameEnvidoEnvidoFalta = gameEnvidoEnvido.next({'Foot': chall_faltaenvido});
			expect(gameEnvidoEnvidoFalta.activePlayer()).toBe('Hand');
			expect(gameEnvidoEnvidoFalta.result()).toBeFalsy();
			expect(gameEnvidoEnvidoFalta.moves().Hand).toEqual([
				chall_quiero,
				chall_noquiero,
			]);

			var gameEnvidoReal = gameEnvido.next({'Hand': chall_realenvido});
			expect(gameEnvidoReal.activePlayer()).toBe('Foot');
			expect(gameEnvidoReal.result()).toBeFalsy();
			expect(gameEnvidoReal.moves().Foot).toEqual([
				chall_quiero,
				chall_noquiero,
				chall_faltaenvido
			]);

			var gameEnvidoRealFalta = gameEnvidoReal.next({'Foot': chall_faltaenvido});
			expect(gameEnvidoRealFalta.activePlayer()).toBe('Hand');
			expect(gameEnvidoRealFalta.result()).toBeFalsy();
			expect(gameEnvidoRealFalta.moves().Hand).toEqual([
				chall_quiero,
				chall_noquiero,
			]);

			var gameEnvidoFalta = gameEnvido.next({'Hand': chall_faltaenvido});
			expect(gameEnvidoFalta.activePlayer()).toBe('Foot');
			expect(gameEnvidoFalta.result()).toBeFalsy();
			expect(gameEnvidoFalta.moves().Foot).toEqual([
				chall_quiero,
				chall_noquiero,
			]);

			var gameReal = game.next({'Foot': chall_realenvido});
			expect(gameReal.activePlayer()).toBe('Hand');
			expect(gameReal.result()).toBeFalsy();
			expect(gameReal.moves().Hand).toEqual([
				chall_quiero,
				chall_noquiero,
				chall_faltaenvido
			]);

			var gameRealFalta = gameReal.next({'Hand': chall_faltaenvido});
			expect(gameRealFalta.activePlayer()).toBe('Foot');
			expect(gameRealFalta.result()).toBeFalsy();
			expect(gameRealFalta.moves().Foot).toEqual([
				chall_quiero,
				chall_noquiero,
			]);

			var gameFalta = game.next({'Foot': chall_faltaenvido});
			expect(gameFalta.activePlayer()).toBe('Hand');
			expect(gameFalta.result()).toBeFalsy();
			expect(gameFalta.moves().Hand).toEqual([
				chall_quiero,
				chall_noquiero,
			]);
		});
	});

}); //// define.
