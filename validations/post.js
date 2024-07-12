import { body } from 'express-validator'

export const postValidation = [
	body('name', 'Имя поста должно быть более 4 символов')
		.isLength({ min: 4 })
		.isString(),
	body('text', 'Пост должен содержать от 5 до 1000 символов')
		.isLength({
			min: 5,
			max: 1000,
		})
		.isString(),
	body('tags', 'Неверный формат тэгов').optional().isArray(),
	body('postImg', 'Неверная ссылка на изображение').optional().isString(),
]
