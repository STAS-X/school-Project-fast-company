const express = require('express');
// const User = require('../models/User');
const { generateUserData } = require('../utils/helpers');
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
		const mongoUsers = await getEntityCollectionFromLiveMongoDB('users');
		const updateUser = req.body;

		const newId = id ? id : updateUser._id;
		if (updateUser._id) delete updateUser._id;
		if (updateUser.licence) delete updateUser.licence;

		const result = await mongoUsers.findOneAndUpdate(
			{ id: { $eq: newId } },
			[
				{
					$set: {
						image: {
							$cond: {
								if: { $eq: [true, { $toBool: '$image' }] },
								then: '$image',
								else: generateUserData().image,
							},
						},
						...updateUser,
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
				{ $project: { _v: 0, _id: 0 } },
			],
			{
				sort: { id: 1 },
				returnNewDocument: true,
				upsert: true,
			}
		);

		// console.log(`User ${updateUser.name} was added to mongo ${{ result }}`);
		res.status(200).json({ ...updateUser, _id: newId });
	} catch (e) {
		res.status(500).json({
			message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
		});
	}
}

router.put('/', async (req, res) => {
	await put(req, res);
});
router
	.put('/:id', async (req, res) => {
		await put(req, res);
	})
	.patch('/:id', async (req, res) => {
		await put(req, res);
	});

router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const mongoUsers = await getEntityCollectionFromLiveMongoDB('users');
		const user = await mongoUsers.findOne(
			{ id: { $eq: id } },
			{
				projection: {
					_id: '$id',
					name: '$name',
					email: '$email',
					password: '$password',
					image: '$image',
					profession: '$profession',
					qualities: '$qualities',
					completedMeetings: '$completedMeetings',
					rate: '$rate',
					bookmark: '$bookmark'
				},
			}
		);
		res.status(200).json(user);
	} catch (e) {
		res.status(500).json({
			message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
		});
	}
});

router.get('/', async (req, res) => {
	try {
		const mongoUsers = await getEntityCollectionFromLiveMongoDB('users');
		const list = await mongoUsers
			.find({})
			.project({
				_id: '$id',
				name: '$name',
				email: '$email',
				password: '$password',
				image: '$image',
				profession: '$profession',
				qualities: '$qualities',
				completedMeetings: '$completedMeetings',
				rate: '$rate',
				bookmark: '$bookmark'
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
