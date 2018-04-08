const mongoose = require('mongoose');
const { Schema } = mongoose;
const planetSchema = new Schema({
	name: {
		type: Schema.Types.String,
		required: true,
		unique: true,
		index: true
	},
	terrain: {
		type: Schema.Types.String,
		required: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	weather: {
		type: Schema.Types.String,
		required: true
	}
});

planetSchema.method('toDTO', function(numberOfFilms) {
	return {
		id: this._id,
		name: this.name,
		terrain: this.terrain,
		weather: this.weather,
		numberOfFilms: numberOfFilms || 0
	}
});

mongoose.model('Planet', planetSchema);