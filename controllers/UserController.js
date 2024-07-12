import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'

export const register = async (req, res) => {
	try {
		const { userName, email, password, avatarUrl } = req.body

		const emailIsUnique = await UserModel.findOne({email: email})

		if (emailIsUnique) {
			return res.status(400).json({
				message: 'Данная почта занята'
			})
		}

		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			userName,
			email,
			passwordHash: hash,
			avatarUrl,
		})

		const user = await doc.save()

		const token = jwt.sign(
			{
				id: user._id,
			},
			'BEARER',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc

		res.status(200).json({
			...userData,
			token,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось зарегистрироваться',
		})
	}
}

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })

		if (!user) {
			return res.status(404).json({
				message: 'Неверный логин или пароль',
			})
		}

		const passwordIsValid = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		)

		if (!passwordIsValid) {
			return res.status(400).json({
				message: 'Неверный логин или пароль',
			})
		}

		const token = jwt.sign(
			{
				id: user._id,
			},
			'BEARER',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc

		res.status(200).json({
			...userData,
			token,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось авторизоваться',
		})
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}

		const { passwordHash, ...userData } = user._doc

		res.status(200).json({ ...userData })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Ошибка аутентификации',
		})
	}
}
