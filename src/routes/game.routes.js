const router = require('express').Router()
const gameController = require('../controllers/game.controller')


router.get('/games', gameController.getAll)
router.get('/games/:id', gameController.getById)
router.post('/games', gameController.addNewGame)
router.delete('/games/:id', gameController.delete)
router.put('/games/:id', gameController.put)
module.exports = router