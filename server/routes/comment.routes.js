const express = require('express');
const auth = require('../middleware/auth.middlware');
const router = express.Router({ mergeParams: true });
const ObjectId = require('mongodb').ObjectId;

const {
	getEntityCollectionFromLiveMongoDB,
} = require('../startUp/initDatabase');

async function get(req, res) {
	try {
		const { orderBy, equalTo } = req.query; // queryString.parse(req.url.replace(/\/\?/g,''));

		const mongoComment = await getEntityCollectionFromLiveMongoDB('comments');
		const list = await mongoComment
			.find(orderBy && equalTo ? { [`${orderBy}`]: equalTo } : {})
			.sort({ created_at: 1 })
			.project({
				_id: '$_id',
				content: '$content',
				pageId: '$pageId',
				userId: '$userId',
				created_at: '$created_at',
			})
			.toArray();

		res.status(200).json(list);
	} catch (e) {
		res.status(500).json({
			message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
		});
	}
}

router.get('/', async (req, res) => {
	await get(req, res);
});

router.post('/', [
	auth,
	async (req, res) => {
		try {
			const mongoComment = await getEntityCollectionFromLiveMongoDB('comments');

			const updateComment = req.body;
			const commentId = updateComment._id;
			delete updateComment._id;

			const resultComment = await mongoComment.findOneAndUpdate(
				{ _id: { $eq: ObjectId(commentId) } },
				[
					{
						$set: {
							...updateComment,
							userId: req.user._id,
							created_at: { $toDate: '$$NOW' },
							updatedAt: { $toDate: '$$NOW' },
							createdAt: {
								$cond: {
									if: { $eq: [true, { $toBool: '$createdAt' }] },
									then: '$createdAt',
									else: { $toDate: '$$NOW' },
								},
							},
						},
					},
					{ $project: { _v: 0 } },
				],
				{
					returnNewDocument: true,
					upsert: true,
				}
			);

			const newComment = await mongoComment.findOne({
				_id: { $eq: ObjectId(resultComment.lastErrorObject.upserted) },
			});

			delete newComment.updatedAt;
			delete newComment.createdAt;
			// console.log(`User ${updateProfession.name} was added to mongo ${result}`);
			res.status(200).json(newComment);
		} catch (e) {
			res.status(500).json({
				message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
			});
		}
	},
]);

router.delete('/:commentId', [
	auth,
	async (req, res) => {
		try {
			const { commentId } = req.params;
			const mongoComment = await getEntityCollectionFromLiveMongoDB('comments');
			const removeComment = await mongoComment.findOne({
				_id: { $eq: ObjectId(commentId) },
			});
			if (!removeComment)
				return res
					.status(400)
					.json({ message: `Comment ${commentId} not found` });
			if (removeComment && removeComment.userId.toString() === req.user._id) {
				await mongoComment.deleteOne({ _id: { $eq: ObjectId(commentId) } });
				return res.send(null);
			} else res.status(401).json({ message: `Unautorized` });
		} catch (e) {
			res.status(500).json({
				message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
			});
		}
	},
]);

module.exports = router;
