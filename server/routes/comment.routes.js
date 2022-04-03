const express = require('express');
const queryString = require('query-string');
const router = express.Router({ mergeParams: true });

const {
	getEntityCollectionFromLiveMongoDB,
} = require('../startUp/initDatabase');

async function get(req, res) {
	try {

		const { orderBy, equalTo } = queryString.parse(req.url.replace(/\/\?/g,''));

		const mongoComment = await getEntityCollectionFromLiveMongoDB('comments');
		const list = await mongoComment
			.find(orderBy && equalTo ? { [`${orderBy.replace(/"/g, '')}`]: equalTo.replace(/"/g, '') } : {})
			.sort({ created_at: 1 })
			.project({
				_id: '$id',
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

router.put('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const mongoComment = await getEntityCollectionFromLiveMongoDB('comments');

		const updateComment = req.body;
		const newId = id ? id : updateComment._id;

		if (updateComment._id) delete updateComment._id;

		const result = await mongoComment.findOneAndUpdate(
			{ id: { $eq: newId } },
			[
				{
					$set: {
						...updateComment,
						id: newId,
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
				sort: { id: 1 },
				returnNewDocument: true,
				upsert: true,
			}
		);
		// console.log(`User ${updateProfession.name} was added to mongo ${result}`);
		res.status(200).json({ ...updateComment, _id: newId });
	} catch (e) {
		res.status(500).json({
			message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
		});
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const mongoComment = await getEntityCollectionFromLiveMongoDB('comments');
		const result = await mongoComment.deleteOne({ id: { $eq: id } });

		if (result.deletedCount === 1) res.status(200).json({});
		else res.status(500).json({ message: `Comment ${id} not found` });
	} catch (e) {
		res.status(500).json({
			message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
		});
	}
});

module.exports = router;
