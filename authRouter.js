const controller = require('./authController.js')
const {check} = require('express-validator')
const {Router} = require('express')
const router = new Router
const authMiddleware = require('./middlewares/authMiddleware.js')

router.post('/signin', [
	check('username', 'Enter valid username!').notEmpty(),
	check('password', 'Enter valid password! It must be less then 16 and more then 4 symbols.').notEmpty().isLength({min: 4, max: 16})
], controller.registerUser)
router.post('/login', controller.authorizeUser)
router.get('/user', authMiddleware, controller.getUser)
router.get('/note', authMiddleware, controller.note)

module.exports = router
