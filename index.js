import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'

import {
	create,
	getAll,
	getMe,
	getOne,
	login,
	register,
	remove,
	update,
} from './controllers/index.js'
import { checkAuth, handleValidationError } from './utils/index.js'
import {
	loginValidation,
	postValidation,
	registerValidation,
} from './validations/index.js'

const app = express()

const storage = multer.diskStorage({
	destination: (_, __, callBack) => {
		callBack(null, 'uploads')
	},
	filename: (_, file, callBack) => {
		callBack(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('uploads'))

mongoose
	.connect(process.env.DB_CONNECT)
	.then(console.log('DB is work'))
	.catch((err) => console.log(err))

app.get('/auth/me', checkAuth, getMe)
app.post('/auth/login', loginValidation, handleValidationError, login)
app.post('/auth/register', registerValidation, handleValidationError, register)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.status(200).json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.post('/posts', checkAuth, postValidation, handleValidationError, create)
app.get('/posts', getAll)
app.get('/posts/:id', getOne)
app.delete('/posts/:id', checkAuth, remove)
app.patch(
	'/posts/:id',
	checkAuth,
	postValidation,
	handleValidationError,
	update
)

app.listen(process.env.PORT, (err) => {
	if (err) {
		return console.log('Error:', err)
	}
	console.log('Server started...')
})
