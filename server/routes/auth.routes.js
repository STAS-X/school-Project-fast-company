const express = require('express');
const User = require('../models/User');
const Token = require('../models/Token');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const tokenService = require('../services/token.service');
const { generateUserData } = require('../utils/helpers');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router({ mergeParams: true });

router.post('/signUp', [
	check('email', 'Неверный email').isEmail(),
	check('password', 'Неверный password').isLength({ min: 6 }),
	async (req, res) => {
		try {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					error: {
						message: 'INVALID_DATA',
						errors: result.array(),
						code: 400,
					},
				});
			}

			const { email, password } = req.body;
			const existUser = await User.findOne({ email });
			if (existUser) {
				return res.status(400).json({
					error: {
						message: 'EMAIL_EXISTS',
						code: 400,
					},
				});
			}
			const hashedPass = await bcrypt.hash(password, 10);
			const newUser = await User.create({
				...generateUserData(),
				...req.body,
				password: hashedPass,
			});
			newUser.id = ObjectId(newUser._id).toString();
			await newUser.save();

			const tokens = tokenService.generate({ _id: newUser.id });
			await tokenService.save(newUser.id, tokens.refreshToken);

            console.log({ ...tokens, userId: newUser.id });
			res.status(201).send({ ...tokens, userId: newUser.id });
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: `На сервере произошла ошибка ${error.message}. Попробуйте позже`,
			});
		}
	},
]);

router.post('/signInWithPassword', [
	check('email', 'Некорректный email').normalizeEmail().isEmail(),
	check('password', 'пароль не должен быть пустым').exists(),
	async (req, res) => {
		try {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					error: {
						message: 'INVALID_DATA',
						errors: result.array(),
						code: 400,
					},
				});
			}

			const { email, password } = req.body;
			const existingUser = await User.findOne({ email });

			if (!existingUser) {
				return res.status(400).send({
					error: {
						message: 'EMAIL_NOT_FOUND',
						code: 400,
					},
				});
			}

			const isPassEqual = await bcrypt.compare(password, existingUser.password);
			if (!isPassEqual) {
				return res.status(400).send({
					error: {
						message: 'INVALID_PASSWORD',
						code: 400,
					},
				});
			}

			const tokens = tokenService.generate({ _id: existingUser.id });
			await tokenService.save(existingUser.id, tokens.refreshToken);

			res.status(200).send({ ...tokens, userId: existingUser.id });
		} catch (error) {
			res
				.status(500)
				.json({ message: 'На сервере произошла ошибка. Попробуйте позже' });
		}
	},
]);

function istokenInvalid(data, dbToken) {
	return !data || !dbToken || data._id != dbToken?.userId.toString();
}

router.post('/token', async (req, res) => {
	try {
		const { refresh_token: refreshToken } = req.body;
		const data = tokenService.validateRefresh(refreshToken);
		const dbToken = await Token.findOne({ refreshToken });

		if (istokenInvalid(data, dbToken)) {
			return res.status(401).json({ message: 'Unautorized' });
		}

		const tokens = tokenService.generate({
			_id: data._id,
		});
		await tokenService.save(data._id, tokens.refreshToken);

		res.status(200).send({ ...tokens, userId: data._id });
	} catch (error) {
		res.status(500).json({
			message: `На сервере произошла ошибка. ${error.message} Попробуйте позже`,
		});
	}
});

module.exports = router;
