const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter.js')

const PORT = 5000

const app = express()
app.use(express.json())
app.use('/', authRouter)

async function start() {
	try {
		await mongoose.connect('mongodb+srv://user:user@cluster0.mdcyxoq.mongodb.net/softness?retryWrites=true&w=majority')
		app.listen(PORT, () => console.log(`Server was succesfully started on ${PORT} port!`))
	} catch (e) {
		console.log(e)
	}
}

start()
