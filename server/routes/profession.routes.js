const express = require('express');
// const Profession = require('../models/Profession');
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
		const mongoProfession = await getEntityCollectionFromLiveMongoDB(
			'professions'
		);

		const validId = id ? isIdValid(id) : false;

		const updateProfession = req.body;
		const newId = id ? id : updateProfession._id;
		delete updateProfession._id;

		const result = await mongoProfession.findOneAndUpdate(
			{ id: { $eq: newId } },
			[
				{
					$set: {
						...updateProfession,
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

		// console.log(`User ${updateProfession.name} was added to mongo ${result}`);
		res.status(200).json({ ...updateProfession, _id: newId });
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
		const mongoProfession = await getEntityCollectionFromLiveMongoDB(
			'professions'
		);
		const profession = await mongoProfession.findOne(
			{ id: { $eq: newId } },
			{
				projection: {
					_id: '$id',
					name: '$name',
				},
			}
		);
		res.status(200).json(profession);
	} catch (e) {
		res.status(500).json({
			message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
		});
	}
});

router.get('/', async (req, res) => {
	try {
		const mongoProfession = await getEntityCollectionFromLiveMongoDB(
			'professions'
		);
		const list = await mongoProfession
			.find({})
			.project({
				_id: '$id',
				name: '$name',
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
