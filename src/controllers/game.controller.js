const Game = require('../models/game.model')
const ApiError = require('../models/apierror.model')
const pool = require('../config/db')

module.exports = {

	getAll(req, res, next) {
		console.log('gameController.get called')
		pool.query(
			"SELECT * FROM games",
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
			"SELECT * FROM games WHERE ID = ?",
			[id],
			function (err, results, fields){
				if (err){
					return next(new ApiError(err, 500))
				}else if(results[0] == null){
					return next(new ApiError(`kon geen game vinden met id ${id}`, 500))
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
		if (req.body.title == null || req.body.title == '') {
			next(new ApiError('Naam is ongeldig', 500))
		} else if (req.body.producer == null || req.body.producer == '') {
			next(new ApiError('Producer is ongeldig', 500))
		} else if (req.body.year == null || req.body.year < 1960 || req.body.year > 2023) {
			next(new ApiError('Jaar is ongeldig', 500))
		} else if (req.body.Type == null || req.body.Type == '') {
			next(new ApiError('Type is ongeldig', 500))
		}else{
			// add game to array of games
			const game = new Game(req.body.title, req.body.producer, req.body.year, req.body.Type)
			const date = new Date()
			
			pool.execute(
				"INSERT INTO games (title, producer, year, Type, LaatstGewijzigdOp) VALUES (?,?,?,?,?)",
				[game.title, game.producer, game.year, game.type, date],
				function (err, results, fields) {
					if (err) {
						return next(new ApiError(err, 500))
					}
					res.status(200).json({
						message: `${req.body.title} is succesvol toegevoegd.`
					}).end()
				}
			)
		}
	},

	delete(req, res, next) {
		const id = req.params.id
		if (id < 0) {
			next(new ApiError('Id does not exist', 404))
		} else {
			pool.execute(
				"DELETE FROM games WHERE ID = ?",
				[id], 
				function(err, results, fields){
					if (err){
						return next(new ApiError(err, 500))
					}
					res.status(200).json({ message: 'game succesvol verwijderd' }).end()
				}
			)
			
		}
	},

	put(req, res, next) {
		const id = req.params.id
		if (id < 0) {
			next(new ApiError('Id does not exist', 404))
		} else {
			// Should get moved to other file / object class
			if (req.body.title == null || req.body.title == '') {
				console.log('TITLE: '+req.body.title)
				next(new ApiError('Naam is ongeldig', 500))
			} else if (req.body.producer == null || req.body.producer == '') {
				next(new ApiError('Producer is ongeldig', 500))
			} else if (req.body.year == null || req.body.year < 1960 || req.body.year > 2023) {
				next(new ApiError('Jaar is ongeldig', 500))
			} else if (req.body.Type == null || req.body.Type == '') {
				next(new ApiError('Type is ongeldig', 500))
			} else {
				const game = new Game(req.body.title, req.body.producer, req.body.year, req.body.Type)
				const date = new Date()
				pool.execute(
					"UPDATE games SET title = ?, producer = ?, year = ?, Type = ?, LaatstGewijzigdOp = ? WHERE ID = ?",
					[game.title, game.producer, game.year, game.type, date, id],
					function (err, results, fields) {
						if (err) {
							return next(new ApiError(err, 500))
						}
						res.status(200).json({ message: req.body.title + ' succesvol geüpdate' }).end()
					}
				)
			}
		}
	},
}