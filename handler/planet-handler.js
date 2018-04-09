const swapiService = require('../service/swapi-service');
const planetRepository = require('../repository/planet-repository')(swapiService);

module.exports = {
	async createPlanet(req, res) {
		const name = req.body.name;
		const terrain = req.body.terrain;
		const weather = req.body.weather;
		if (!name || !terrain || !weather) {
			return res.status(400).send('Missing params');
		}
		const oldPlanet = await planetRepository.findPlanetByName(name);
		if (oldPlanet) {
			return res.status(409).send('The planet already exists');
		}
		const planet = await planetRepository.createPlanet(req.user._id, name, terrain, weather);
		res.set('Location', `/api/planet/${planet.id}`);
		return res.status(204).send();
	},
	async getPlanetById(req, res) {
		const planet = await planetRepository.findPlanetById(req.params.id);
		if (!planet) {
			return res.status(404).send('Planet not found');
		}
		return res.json(planet);
	},
	async getPlanetByName(req, res, next) {
		const name = req.query.name;
		if (name) {
			const planet = await planetRepository.findPlanetByName(name);
			if (!planet) {
				return res.status(404).send('Planet not found');
			}
			return res.json(planet);
		}
		next();
	},
	async getPlanets(req, res) {
		const page = Math.abs(req.query.page) || 1;
		const size = Math.abs(req.query.size) || 10;
		const planets = await planetRepository.getPlanets(page * size, size);
		return res.json(planets);
	},
	async getPlanetsByUser(req, res) {
		const page = Math.abs(req.query.page) || 1;
		const size = Math.abs(req.query.size) || 10;
		const planets = await planetRepository.getPlanetsByUser(req.user._id, page * size, size);
		return res.json(planets);
	},
	async updatePlanet(req, res) {
		const planet = await planetRepository.updatePlanet(req.params.id, req.body);
		if (!planet) {
			return res.status(404).send('Planet not found');
		}
		res.json(planet);
	},
	async removePlanet(req, res) {
		const status = await planetRepository.removePlanet(req.params.id, req.user._id);
		if (!status) {
			return res.status(404).send('Cannot remove this planet');
		}
		res.status(204).send();
	}
};