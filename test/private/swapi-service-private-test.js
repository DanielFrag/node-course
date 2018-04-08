const chai = require('chai');
const rewire = require('rewire');
const swapiService = rewire('../../service/swapi-service');

describe('Test swapi-service (private functions)', function () {
	this.timeout(30000);
	it('Should get all planets', async () => {
		const getPlanets = swapiService.__get__('getPlanets');
		const p = await getPlanets();
		chai.expect(p).exist;
		const keys = Object.keys(p);
		chai.expect(p.lastCacheUpdate).exist;
		chai.expect(p.Alderaan).exist;
		chai.expect(keys.length).to.be.greaterThan(61);
	});
});