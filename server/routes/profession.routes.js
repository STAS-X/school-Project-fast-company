const express = require('express');
const Profession = require('../models/Profession');
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
	try {
        console.log('Profession query by mongo');
        const list = await Profession.find();
        res.status(200).json(list);

	} catch (e) {
		res
			.status(500)
			.json({
				message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
			});
	}
});

module.exports = router;
