const mongoose = require('mongoose');
const Planet = mongoose.model('Planet');

async function getDtoWithFilms(swapiService, planet) {
	const numOfFilms = await swapiService.getNumberOfFilms(planet.name);
	return planet.toDTO(numOfFilms);
}

async function getPlanetList(swapiService, criteria, skip, limit) {
	const planets = await Planet
		.find(criteria)
		.sort({name: 1})
		.skip(skip || 0)
		.limit(limit || 10);
	const pDTO = [], len = planets.length;
	for (let i = 0; i < len; i++) {
		const p = await getDtoWithFilms(swapiService, planets[i]);
		pDTO.push(p);
	}
	return pDTO;
}

module.exports = (swapiService) => {
	return {
		async createPlanet(userId, name, terrain, weather) {
			const p = await Planet.create({
				name,
				terrain,
				userId,
				weather
			});
			return getDtoWithFilms(swapiService, p);
		},
		async findPlanetById(planetId) {
			const planet = await Planet.findById(planetId);
			if (!planet) {
				return;
			}
			return getDtoWithFilms(swapiService, planet);
		},
		async findPlanetByName(planetName) {
			const planet = await Planet.findOne({
				name: planetName
			});
			if (!planet) {
				return;
			}
			return getDtoWithFilms(swapiService, planet);
		},
		async getPlanets(skip, limit) {
			return getPlanetList(swapiService, {}, skip, limit);
		},
		async getPlanetsByUser(userId, skip, limit) {
			return getPlanetList(swapiService, {
				userId
			}, skip, limit);
		},
		async updatePlanet(planetId, data) {
			const fields = {};
			if (data.name) {
				fields.name = data.name
			}
			if (data.terrain) {
				fields.terrain = data.terrain;
			}
			if (data.weather) {
				fields.weather = data.weather;
			}
			const p = await Planet.findByIdAndUpdate(planetId, fields, {
				new: true
			});
			if (!p) {
				return;
			}
			return getDtoWithFilms(swapiService, p);
		},
		async removePlanet(planetId, userId) {
			const p = await Planet.remove({
				_id: planetId,
				userId
			});
			return p.n != 0;
		}
	};
}