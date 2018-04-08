const { port } = require('./params');
const express = require('express');
const startDB = require('./db');
const app = express();
const bodyParser = require('body-parser');
const router = require('./router');
module.exports = async () => {
	await startDB();
    app.set('port', port);
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "DELETE, GET, OPTIONS, POST, PUT");
		res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
		next();
	});
    app.use(bodyParser.json({
		type: 'application/json'
	}));
	router(app);
	app.use((err, req, res, next) => {
        console.log(err);
        return res.status(500).send('Internal error');
    });
    return app;
};