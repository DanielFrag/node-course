const requestUtil = require('../util/request-util');
const { swapiCacheExpiresIn } = require('../config/params');
let planetsCache = {};

async function getPlanetsPage(page) {
	const { body } = await requestUtil(page || 'https://swapi.co/api/planets');
	return body;
}

async function getPlanets() {
	const dateInterval = (new Date() - planetsCache.lastCacheUpdate) / 1000;
	if (!dateInterval || dateInterval > swapiCacheExpiresIn) {
		await updatePlanetsCache();
	}
	return planetsCache;
}

async function updatePlanetsCache() {
	const results = [];
	try {
		let page, planetsCacheKeys;
		do {
			const url = page && page.next;
			page = await getPlanetsPage(url);
			if (page.results) {
				results.push(...page.results);
			}
		} while (page.next);
	} catch (e) {
		return;
	}
	planetsCache = results.reduce((t, p) => {
		t[p.name] = p;
		return t;
	}, {
		lastCacheUpdate: new Date()
	});
	return;
}

module.exports = {
	async getPlanetByName(planetName) {
		try {
			const planets = await getPlanets();
			return planets[planetName];
		} catch (e) {
			return;
		}
	}
};