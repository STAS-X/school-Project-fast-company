const { Schema, model } = require('mongoose');

const schema = new Schema(
	{
		id: {
			type: String,
		},
		content: {
			type: String,
			required: true,
		},
		// На чьей странице находится комментарий
		pageId: {
			//type: Schema.Types.ObjectId,
			type: String,
			ref: 'User',
			required: true,
		},
		// Кто оставил комментарий
		userId: {
			//type: Schema.Types.ObjectId,
			type: String,
			ref: 'User',
			required: true,
		},
		created_at: {
			//type: Schema.Types.ObjectId,
			type: Date,
			required: true,
		},
	},
	{
		timestamps: { createdAt: 'created_at' },
	}
);

module.exports = model('Comment', schema);
