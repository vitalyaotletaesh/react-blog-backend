import { body } from 'express-validator'

export const registerValidation = [
	body('email', 'Неверный формат почты').isEmail(),
	body('password', 'Пароль должен быть не короче 5 символов').isLength({
		min: 5,
	}),
	body('userName', 'Имя должно быть не короче 3 символов').isLength({ min: 3 }),
	body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
]

export const loginValidation = [
	body('email', 'Неверный формат почты').isEmail(),
	body('password', 'Пароль должен быть не короче 5 символов').isLength({
		min: 5,
	}),
]