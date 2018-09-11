/** Truco solution.
*/
var ludorum_game_truco = require('../build/ludorum-game-truco'),
	ludorum = require('ludorum'),
	base = require('creatartis-base'),
	Database = require('better-sqlite3');

function setupDatabase(path) {
	var db = new Database(path || './solution-truco.sqlite');
	db.pragma('journal_mode = OFF'); // Disable transactions.
	db.pragma('cache_size = -128000'); // Increase default cache size.
	db.pragma('encoding = "UTF-8"'); // Increase default cache size.

	var stmt = db.prepare('CREATE TABLE IF NOT EXISTS Truco ('+
	'	id TEXT PRIMARY KEY,'+
	'	hand_wins INTEGER,'+
	'	foot_wins INTEGER)'
	);
	stmt.run();

	return db;
}

function addCase(cardsHand, cardsFoot, callback) {
	var game = new ludorum_game_truco.ai.SubTruco([], cardsHand, cardsFoot),
		solution = ludorum.players.MiniMaxPlayer.solution(game, { 
			horizon: 10, 
			gameKey: (g) => g.identifier()
		}),
		count = 0;
	for (var id in solution) {
		callback(id, solution[id]);
		count++;
	}
	return count;
}

(function main() { /////////////////////////////////////////////////////////////////////////////////
	var db = setupDatabase(),
		insertStmt = db.prepare('INSERT INTO Truco VALUES (?, ?, ?)'),
		caseCount = 0,
		recordCount = 0,
		LOGGER = base.Logger.ROOT;
	LOGGER.appendToConsole();
	LOGGER.appendToFile(base.Text.formatDate(new Date(), '"solution-truco-"yyyymmdd-hhnnss".log"'));
	LOGGER.info("Starting Truco solution calculation.");

	ludorum_game_truco.ai.SubTruco.enumerateCards().take(1e2).forEachApply(function (cardsHand, cardsFoot) {
		caseCount++;
		recordCount += addCase(cardsHand, cardsFoot, function (id, result) {
			insertStmt.run(id, result > 0 ? 1 : 0, result < 0 ? 1 : 0);
		});
		if (caseCount % 50 === 0) {
			LOGGER.info('Processed '+ caseCount +' cases ('+ recordCount +' records).');
			//db.exec('vacuum'); // Optimize the database. 
		}
	});
	
	LOGGER.info("Finished.");
})();
