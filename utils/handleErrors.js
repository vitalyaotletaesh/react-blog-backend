import { validationResult } from 'express-validator'

export const handleValidationError = (req, res, next) => {
	const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		next()
}