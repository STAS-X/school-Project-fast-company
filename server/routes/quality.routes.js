const express = require('express');
// const Quality = require('../models/Quality');
const router = express.Router({ mergeParams: true });

const ObjectId = require('mongodb').ObjectId;
const {
	getEntityCollectionFromLiveMongoDB,
} = require('../startUp/initDatabase');

function isIdValid(id) {
	try {
		return ObjectId(id) ? true : false;
	} catch (error) {
		return false;
	}
}

async function put(req, res) {
	try {
		const { id } = req.params;

		const mongoQualities = await getEntityCollectionFromLiveMongoDB(
			'qualities'
		);
		const updateQuality = req.body;
		const newId = id ? id : updateQuality._id;
		// const validId = id ? isIdValid(id) : false;

		if (updateQuality._id) delete updateQuality._id;
		const result = await mongoQualities.findOneAndUpdate(
			{ id: { $eq: newId } },
			[
				{
					$set: {
						...updateQuality,
						id: newId,
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

		// console.log(`User ${updateQuality.name} was added to mongo ${result}`);
		res.status(200).json({ ...updateQuality, _id: newId });
	} catch (e) {
		res.status(500).json({
			message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
		});
	}
}

router.put('/', async (req, res) => {
	await put(req, res);
});
router.put('/:id', async (req, res) => {
	await put(req, res);
});

router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const mongoQualities = await getEntityCollectionFromLiveMongoDB(
			'qualities'
		);
		const quality = await mongoQualities.findOne({ id: { $eq: id } }, 
			{
				projection: {
					_id: '$id',
					name: '$name',
					color: '$color',
				},
			});
		res.status(200).json(quality);
	} catch (e) {
		res.status(500).json({
			message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
		});
	}
});

router.get('/', async (req, res) => {
	try {
		const mongoQualities = await getEntityCollectionFromLiveMongoDB(
			'qualities'
		);
		const list = await mongoQualities
			.find({})
			.project({
				_id: '$id',
				name: '$name',
				color: '$color',
			})
			.toArray();
		res.status(200).json(list);
	} catch (e) {
		res.status(500).json({
			message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
		});
	}
});

module.exports = router;
