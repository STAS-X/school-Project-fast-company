const { Schema, model } = require('mongoose');
//const Profession = require('./Profession');
//const Quality = require('./Quality');

const schema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		completedMeetings: Number,
		image: {
			type: String,
			required: true,
		},
		rate: Number,
		sex: {
			type: String,
			enum: 'male' | 'female' | 'other',
		},
		profession: {
			type: Schema.Types.ObjectId,
			ref: 'Profession',
			required: true,
		},
		qualities: [{
			type: Schema.Types.ObjectId,
			ref: 'Quality',
			isArray: true,
			required: true,
		}],
	},
	{
		timestamps: true,
	}
);

module.exports = model('User', schema);
