// This is a copy fo similar test cases used in ludorum.
define(['creatartis-base', 'sermat', 'ludorum', 'ludorum-game-truco'],
function (base, Sermat, ludorum, ludorum_game_truco) {

	describe("ludorum-game-truco", function () {

		it("core definitions", function () {
			expect(typeof ludorum_game_truco.Truco).toBe('function');
		}); //// it "core definitions"

	}); //// describe "ludorum-game-truco"

	describe("ludorum-game-subtruco", function() {

		it("calculates possible moves", function () {
			var game = new ludorum_game_truco.ai.SubTruco("Hand", [2, 4, 6], [1, 3, 5]);

			expect(game.moves().Hand).toEqual([0, 1, 2]);
			console.log(game.activePlayer());
			// Switch to foot
			//expect(game.moves().Foot).toEqual([0, 1, 2]);

			var game2 = new ludorum_game_truco.ai.SubTruco("Hand", [2], [1]);
			expect(game2.moves().Hand).toEqual([0]);

			// Switch to foot
			//expect(game2.moves().Foot).toEqual([0]);
		});

		it("has a winner", function() {
			var gameT = new ludorum_game_truco.ai.SubTruco("Hand", [2, 4, 6], [1, 3, 5]);

			expect(gameT.result()).toBeFalsy();

			// TODO: Test games with 'pardas', all possible combinations
		});

		it("can be played", function() {
			var game = new ludorum_game_truco.ai.SubTruco("Hand", [2, 4, 6], [1, 3, 5]);

			expect(game.table).toEqual([]);

			game = game.next({'Hand': 0});

			expect(game.cardsHand).toEqual([4, 6]);
			expect(game.cardsFoot).toEqual([1, 3, 5]);
			expect(game.table).toEqual([2]);
			expect(game.activePlayer()).toBe('Foot');

			game = game.next({'Foot': 2});

			expect(game.cardsHand).toEqual([4, 6]);
			expect(game.cardsFoot).toEqual([1, 3]);
			expect(game.table).toEqual([2, 5]);
			expect(game.activePlayer()).toBe('Hand');

			game = game.next({'Hand': 0});

			expect(game.cardsHand).toEqual([6]);
			expect(game.cardsFoot).toEqual([1, 3]);
			expect(game.table).toEqual([2, 5, 4]);
			expect(game.activePlayer()).toBe('Foot');

			game = game.next({'Foot': 1});

			expect(game.cardsHand).toEqual([6]);
			expect(game.cardsFoot).toEqual([1]);
			expect(game.table).toEqual([2, 5, 4, 3]);
			expect(game.activePlayer()).toBe('Hand');
		});

	});

}); //// define.
