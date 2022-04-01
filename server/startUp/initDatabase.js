
const Profession = require('../models/Profession');
const Quality = require('../models/Quality');

const professionMock = require('../mock/profession.json');
const qualitiesMock = require('../mock/qualities.json');

const config = require('config');
const mongoose = require('mongoose');

const options = { server: { socketOptions: { keepAlive: 1, noDelay:true } } };

async function initDb() {
    const professions = await Profession.find();
    if (professions.length !== professionMock.length) {
        await createInitialEntity(Profession, professionMock);
    }
    const qualities = await Quality.find();
		if (qualities.length !== qualitiesMock.length) {
			await createInitialEntity(Quality, qualitiesMock);
		}

}

async function getEntityCollectionFromLiveMongoDB(collectionName) {
		const mongoDb = await mongoose.connect(config.get('mongoUri'), options);
        const dbName = mongoDb.connection.name;
		return await mongoDb.connection.client
			.db(dbName)
			.collection(collectionName);
	};

async function createInitialEntity(Model, data) {
    await Model.collection.drop();
    return Promise.all(data.map(async item => {
        try {
            delete item._id
            const newItem = new Model(item);
            await newItem.save();
            return newItem;
        } catch(e) {
            console.log(e.message);
            return e;
        }
    }))
}

module.exports = { initDb, getEntityCollectionFromLiveMongoDB };