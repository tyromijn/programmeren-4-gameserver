const Game = require('../models/game.model')
const ApiError = require('../models/apierror.model')
const pool = require('../config/db')
let games = [
	new Game('Battlefield 5', 'EA', 2018, 'FPS'),
	new Game('Call of Duty: Black Ops 4', 'Treyarch', 2018, 'FPS'),
	new Game('Minecraft', 'Mojang', 2010, 'Sandbox'),
]

module.exports = {

	getAll(req, res, next) {
		console.log('gameController.get called')
		pool.query(
			'SELECT * FROM games',
			function (err, results, fields) {
				if (err){
					return next(new ApiError(err, 500))
				}
				res.status(200).json({result: results}).end()
			}
		)
		
	},

	getById(req, res, next) {
		const id = req.params.id
		console.log("GET REQUEST FOR ID: " + id)

		pool.execute(
			'SELECT * FROM games WHERE ID = ?',
			[id],
			function (err, results, fields){
				if (err){
					return next(new ApiError(err, 500))
				}
				res.status(200).json({
					result: results
				}).end()
			}
		)
	},

	addNewGame(req, res, next) {
		console.log('gameController.addNewGame called')
		console.dir(req.body)

		// Should get moved to other file / object class
		if (req.body.name == null || req.body.name == '') {
			next(new ApiError('Naam is ongeldig', 500))
		} else if (req.body.producer == null || req.body.producer == '') {
			next(new ApiError('Producer is ongeldig', 500))
		} else if (req.body.year == null || req.body.year < 1960 || req.body.year > 2023) {
			next(new ApiError('Jaar is ongeldig', 500))
		} else if (req.body.type == null || req.body.type == '') {
			next(new ApiError('Type is ongeldig', 500))
		}else{
			// add game to array of games
			const game = new Game(req.body.name, req.body.producer, req.body.year, req.body.type)
			games.push(game)

			res.status(200).json({
				message: req.body.name + ' succesvol toegevoegd'
			}).end()
		}
	},

	delete(req, res, next) {
		const id = req.params.id
		if (id < 0 || id > games.length - 1) {
			next(new ApiError('Id does not exist', 404))
		} else {
			games.splice(id, 1)
			res.status(200).json({message: 'game succesvol verwijderd'}).end()
		}
	},

	put(req, res, next) {
		const id = req.params.id
		if (id < 0 || id > games.length - 1) {
			next(new ApiError('Id does not exist', 404))
		} else {
			// Should get moved to other file / object class
			if (req.body.name == null || req.body.name == ''){
				next(new ApiError('Naam is ongeldig', 500))
			}else if(req.body.producer == null || req.body.producer == ''){
				next(new ApiError('Producer is ongeldig', 500))
			}else if(req.body.year == null || req.body.year < 1960 || req.body.year > 2023){
				next(new ApiError('Jaar is ongeldig', 500))
			}else if (req.body.type == null || req.body.type == ''){
				next(new ApiError('Type is ongeldig', 500))
			}else{
				const game = new Game(req.body.name, req.body.producer, req.body.year, req.body.type)
				games.splice(id, 1, game)
				res.status(200).json({ message: req.body.name + ' succesvol geüpdate' }).end()
			}
		}
	}
}