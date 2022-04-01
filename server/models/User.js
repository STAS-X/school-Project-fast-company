const { Schema, model } = require('mongoose');
//const Profession = require('./Profession');
//const Quality = require('./Quality');

const isEmail = (value) => {
	return /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(value);
};

const schema = new Schema(
	{
		id: {
			type: String,
		},
		name: {
			type: String,
			trim: true,
			required: 'Name must be not empty',
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
		},
		bookmark: {
			type: Boolean,
			default: false
		},
		completedMeetings: Number,
		image: {
			type: String,
		},
		rate: Number,
		sex: {
			type: String,
			enum: 'male' | 'female' | 'other',
		},
		profession: {
			type: String,
			// type: Schema.Types.ObjectId,
			ref: 'Profession',
			required: true,
		},
		qualities: [
			{
				type: String,
				// type: Schema.Types.ObjectId,
				ref: 'Quality',
				required: true,
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = model('User', schema);
