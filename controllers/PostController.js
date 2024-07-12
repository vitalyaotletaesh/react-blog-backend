import PostModel from '../models/Post.js'

export const create = async (req, res) => {
	try {
		const { name, text, postImg, tags } = req.body

		const doc = new PostModel({
			name,
			text,
			postImg: postImg ? postImg : '',
			tags: tags ? tags : [],
			user: req.userId,
		})

		const post = await doc.save()

		res.status(200).json({
			post: post._doc,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Ошибка при создании статьи',
		})
	}
}

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec()

		if (!posts) {
			return res.status(404).json({
				message: 'Не удалось получить статьи',
			})
		}

		res.status(200).json({
			posts,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Ошибка при получении статей',
		})
	}
}

export const getOne = async (req, res) => {
	const postId = req.params.id
	try {
		const post = await PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				new: true,
			}
		)

		if (!post) {
			return res.status(404).json({
				message: 'Статья не найдена',
			})
		}

		res.status(200).json({
			post,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Ошибка при получении статьи',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const postId = req.params.id
		const post = await PostModel.findOneAndDelete({ _id: postId })

		if (!post) {
			return res.status(400).json({
				message: 'Не удалось удалить статью',
			})
		}

		res.status(200).json({
			message: 'Статья успешно удалена',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Ошибка при удалении статьи',
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id
		const { name, text, postImg, tags } = req.body
		const post = await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				name,
				text,
				postImg,
				tags,
				user: req.userId,
			}
		)

		if (!post) {
			return res.status(500).json({
				message: 'Не удалось обновить статью',
			})
		}

		res.status(200).json({
			message: 'Статья успешно обновлена',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Ошибка при обновлении статьи',
		})
	}
}
