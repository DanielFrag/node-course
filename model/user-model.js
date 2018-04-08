const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.model('User', new Schema({
	login: {
		type: Schema.Types.String,
		required: true,
		unique: true,
		index: true
	},
	password: {
		type: Schema.Types.String,
		required: true
	},
	session: Schema.Types.String
}));