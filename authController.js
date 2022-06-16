const User = require('./User.js')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('./config.js')

const generateAccesToken = (id) => {
	const payload = {
		id
	}

	return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class authController {
	async registerUser(req, res) {
		try {
			const errs = validationResult(req)
			if (!errs.isEmpty()) {
				return res.status(400).json('Registration error from client side!', errs)
			}
			const {username, password} = req.body
			const candidate = await User.findOne({username})
			if(candidate) {
				res.status(400).json({message: 'There is already a person with same username.'})
			}
			const hashedPassword = bcrypt.hashSync(password, 7)
			const user = new User({username, password: hashedPassword})
			await user.save()

			return res.json({message: 'The user has been succesfully created!'})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: 'Registration error'})
		}
	}

	async authorizeUser(req, res) {
		try {
			const {username, password} = req.body
			const user = await User.findOne({username})
			if (!user) {
				return res.status(404).json({message: 'User is not found'})
			}
			const validPassword = bcrypt.compareSync(password, user.password)
			if (!validPassword) {
				return res.status(400).json({message: 'Password is wrong'})
			}
			const token = generateAccesToken(user._id)

			return res.json({token})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: 'Authorization error'})
		}
	}

	async getUser(req, res) {
		try {
			const {id} = req
			const user = await User.findById(id.id)
			return res.json(user)
		} catch (e) {
			console.log(e)
			res.status(400).json({message: 'An error occurred while getting user data'})
		}
	}

	async writeNote(req, res) {
		try {
			const {note} = req.body
			const id = req.id.id
			await User.findByIdAndUpdate(id, {$set: {note: note}})
			return res.json({message: `Note has been succesfully writed '${note}'`})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: 'An error occurred while writing the note'})
		}
	}
}

module.exports = new authController()
