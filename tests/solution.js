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

function addCase(cardsHand, cardsFoot, db) {
	var game = new ludorum_game_truco.ai.SubTruco([], cardsHand, cardsFoot),
		solution = ludorum.players.MiniMaxPlayer.solution(game, { 
			horizon: 10, 
			gameKey: (g) => g.identifier()
		}),
		records = [];
	for (var id in solution) {
		records.push("('"+ id +"',"+ (solution[id] > 0 ? "1,0" : "0,1") +")");
	}
	var stmt = db.prepare('INSERT OR IGNORE INTO Truco VALUES '+ records.join(','));
	return stmt.run().changes;
}

(function main() { /////////////////////////////////////////////////////////////////////////////////
	var fileName = 'solution-truco',
		db = setupDatabase('./'+ fileName +'.sqlite'),
		caseCount = 0,
		recordCount = 0,
		LOGGER = base.Logger.ROOT;
	LOGGER.appendToConsole();
	LOGGER.appendToFile(base.Text.formatDate(new Date(), '"'+ fileName +'-"yyyymmdd-hhnnss".log"'));
	LOGGER.info("Starting Truco solution calculation.");

	ludorum_game_truco.ai.SubTruco.enumerateCards().forEachApply(function (cardsHand, cardsFoot) {
		caseCount++;
		recordCount += addCase(cardsHand, cardsFoot, db);
		if (caseCount % 100 === 0) {
			LOGGER.info('Processed '+ caseCount +' cases ('+ recordCount +' records).');
		}
	});
	
	LOGGER.info("Finished.");
})();
