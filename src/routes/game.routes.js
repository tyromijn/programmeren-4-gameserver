const router = require('express').Router()
const gameController = require('../controllers/game.controller')
const authController = require('../controllers/authenticator.controller')


router.get('/games', gameController.getAll)
router.get('/games/:id', gameController.getById)
router.post('/games', gameController.addNewGame)
router.delete('/games/:id', gameController.delete)
router.put('/games/:id', gameController.put)

router.post('/register', authController.register)
router.post('/login', authController.login)
router.delete('/register', authController.delete)
router.put('/register', authController.update)
module.exports = router