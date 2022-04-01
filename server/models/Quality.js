const {Schema, model} = require('mongoose');

const schema = new Schema(
	{
		id: {
			type: String,
		},
		name: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = model('Quality', schema)