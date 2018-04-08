const mongoose = require('mongoose');
const { dbUrl } = require('./params');
mongoose.Promise = global.Promise;
const dirReaderHelper = require('../helper/dir-reader-helper');
dirReaderHelper('model');

mongoose.connection.on('error', () => {
	console.log('DB connection error');
	process.exit(0);
});

mongoose.connection.on('connected', () => {
	console.log('DB connected');
});

process.on('SIGINT', () => {
	mongoose.connection.close(dbCloseError => {
		if (dbCloseError) {
			console.log(`DB connection close error: ${dbCloseError}`);
		} else {
			console.log('DB connection closed');
		}
		process.exit(0);
	});
});

module.exports = async() => {
	try {
		await mongoose.connect(dbUrl);
	} catch(e) {
		console.log(`Mongo connect error: ${e}`);
		process.exit(0);
	}
}