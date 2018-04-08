const requestUtil = require('../util/request-util');
const { swapiCacheExpiresIn } = require('../config/params');
let planetsCache = {};

function isValidCache() {
	const dateInterval = (new Date() - planetsCache.lastCacheUpdate) / 1000;
	return dateInterval && dateInterval < swapiCacheExpiresIn;
}

async function getPlanets() {
	if (!isValidCache()) {
		await updatePlanetsCache();
	}
	return planetsCache;
}

async function getPlanetsPage(page) {
	const { body } = await requestUtil(page || 'https://swapi.co/api/planets');
	return body;
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
	if (isValidCache()) {
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
	async getNumberOfFilms(planetName) {
		try {
			const planets = await getPlanets();
			if (!planets[planetName]) {
				return 0;
			}
			return planets[planetName].films.length;
		} catch (e) {
			return;
		}
	}
};