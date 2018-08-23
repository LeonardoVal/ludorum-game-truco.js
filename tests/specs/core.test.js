﻿// This is a copy fo similar test cases used in ludorum.
define(['creatartis-base', 'sermat', 'ludorum', 'ludorum-game-truco'],
function (base, Sermat, ludorum, ludorum_game_truco) {

	describe("ludorum-game-truco", function () {

		it("core definitions", function () {
			expect(typeof ludorum_game_truco.Truco).toBe('function');
		}); //// it "core definitions"

	}); //// describe "ludorum-game-truco"

	describe("ludorum-game-subtruco", function() {
		function theWinnerIs(hand, foot, winner) {
			var winnerIsGame = new ludorum_game_truco.ai.SubTruco("Hand", hand, foot);

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
			var game = new ludorum_game_truco.ai.SubTruco("Hand", [2, 4, 6], [1, 3, 5]);

			expect(game.moves().Hand).toEqual([0, 1, 2]);
			// Switch to foot
			//expect(game.moves().Foot).toEqual([0, 1, 2]);

			var game2 = new ludorum_game_truco.ai.SubTruco("Hand", [2], [1]);
			expect(game2.moves().Hand).toEqual([0]);

			// Switch to foot
			//expect(game2.moves().Foot).toEqual([0]);
		});

		it("has a winner", function() {
			console.log("Started it has a winner");
			var gameT = new ludorum_game_truco.ai.SubTruco("Hand", [2, 4, 6], [1, 3, 5]);

			expect(gameT.result()).toBeFalsy();

			// TODO: Test games with 'pardas', all possible combinations

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
			var game = new ludorum_game_truco.ai.SubTruco("Hand", [2, 4, 6], [1, 3, 5]);

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
		});

		it("can be solved by MiniMax", function () {
			console.log("Testing time!");
			var game = new ludorum_game_truco.ai.SubTruco('Hand', [12, 5, 8], [6, 7, 5]);
			var p = new ludorum.players.MiniMaxPlayer({horizon: Infinity});
			var t0 = performance.now();
			p.minimax(game, 'Hand', 0);
			var t1 = performance.now();

			console.log("It took: " + (t1 - t0) + " milliseconds");
		});

	});

}); //// define.
