const Game = require('../models/game.model')
const ApiError = require('../models/apierror.model')

let games = [
	new Game('Battlefield 5', 'EA', 2018, 'FPS')
]

// Voorbeeld werken met arrays
games.forEach((item) => {
	// doe iets met item
})

module.exports = {

	getAll(req, res) {
		console.log('gameController.get called')
		res.status(200).json(games).end()
	},

	getById(req, res, next) {
		const id = req.params.gameId
		console.log('id = ' + id)

		if(id < 0 || id > games.length-1){
			next(new ApiError('Id does not exist', 404))
		} else {
			res.status(200).json(games[id]).end()
		}
	},

	addNewGame(req, res) {
		console.log('gameController.addNewGame called')
		console.dir(req.body)

		// add game to array of games
		const game = new Game(req.body.name, req.body.producer, req.body.year, req.body.type)
		games.push(game)

		res.status(200).json({ 
			message: req.body.name + ' succesvol toegevoegd'
		}).end()
	}

}