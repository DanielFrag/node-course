const { checkAuthToken } = require('../handler/user-handler');
const planetHandler = require('../handler/planet-handler');
const router = require('express').Router();

module.exports = (app) => {
	router.use(checkAuthToken);
	router
		.route('/')
		.get(planetHandler.getPlanetByName, planetHandler.getPlanets)
		.post(planetHandler.createPlanet);
	router.get('/my-planets', planetHandler.getPlanetsByUser);
	router
		.route('/:id')
		.get(planetHandler.getPlanetById)
		.put(planetHandler.updatePlanet)
		.delete(planetHandler.removePlanet);
	app.use('/api/planet', router);
}