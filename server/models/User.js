const { Schema, model } = require('mongoose');
const { generateUserData } = require('../utils/helpers');
//const Profession = require('./Profession');
//const Quality = require('./Quality');

const isEmail = (value) => {
	return /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(value);
};
const isPassword = (value) => {
	console.log(password);
	return /^(?=.*?[a-z])(?=.*?[A-Z])[a-zA-Z0-9]{3}$/.test(value);
};

const schema = new Schema(
	{
		id: {
			type: String,
		},
		name: {
			type: String,
			trim: true,
			// required: 'Name must be not empty',
		},
		email: {
			type: String,
			required: 'Email must be not empty',
			trim: true,
			lowercase: true,
			validate: [
				{ validator: (value) => isEmail(value), msg: 'Invalid email.' },
			],
			unique: true,
		},
		password: {
			type: String,
			required: 'Password must be not empty',
			// validate: [
			//	{ validator: (value) => isPassword(value), msg: 'Invalid password.' },
			// ],
		},
		bookmark: {
			type: Boolean,
			default: false,
		},
		completedMeetings: Number,
		image: {
			type: String,
			default: generateUserData().image
		},
		rate: Number,
		sex: {
			type: String,
			enum: ['male', 'female', 'other'],
		},
		profession: {
			type: String,
			// type: Schema.Types.ObjectId,
			ref: 'Profession',
			default: '67edca3eeb7f6ageed471818',
			// required: true,
		},
		qualities: {
			type: [
				{
					type: String,
					// type: Schema.Types.ObjectId,
					ref: 'Quality',
					// required: true,
				},
			],
			default: ['67edca3eeb7f6ageed471198'],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = model('User', schema);
