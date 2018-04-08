const userHandler = require('../handler/user-handler');
const router = require('express').Router();

module.exports = (app) => {
	router.post('/', userHandler.createUser);
	router.post('/logout', userHandler.checkAuthToken, userHandler.logout);
	router
		.route('/login')
		.get(userHandler.findLogin)
		.post(userHandler.login);
	app.use('/api/user', router);
}