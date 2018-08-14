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

			expect(game.moves()[game.activePlayer()]).toEqual([0, 1, 2]);
			game.activePlayer = "Foot";
			expect(game.moves()[game.activePlayer()]).toEqual([0, 1, 2]);
		});

	});

}); //// define.
