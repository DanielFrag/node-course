const requestUtil = require('../util/request-util');
let planetsCache = {};

async function getPlanetsPage(page) {
	const { body } = await requestUtil(page || 'https://swapi.co/api/planets');
	return body;
}

async function getPlanets() {
	let page = await getPlanetsPage();
	let planetsCacheKeys = Object.keys(planetsCache);
	if (!page || !page.count || page.count == planetsCacheKeys.length) {
		return planetsCache;
	}
	const results = [];
	results.push(...page.results);
	while (page.next) {
		page = await getPlanetsPage(page.next);
		results.push(...page.results);
	}
	planetsCache = results.reduce((t, p) => {
		t[p.name] = p;
		return t;
	}, {});
	return planetsCache;
}

module.exports = {
	async getPlanetByName(planetName) {
		try {
			const planets = await getPlanets();
			return planets[planetName];
		} catch (e) {
			return planetsCache;
		}
	}
};