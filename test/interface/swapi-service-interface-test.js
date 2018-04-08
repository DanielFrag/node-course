const chai = require('chai');
const swapiService = require('../../service/swapi-service');

describe('Request util teste', function() {
	this.timeout(30000);
	it('Should request some planets', async () => {
		try {
			const tatooine = await swapiService.getNumberOfFilms('Tatooine');
			const jakku = await swapiService.getNumberOfFilms('Jakku');
			const chandrila = await swapiService.getNumberOfFilms('Chandrila');
			chai.expect(tatooine).to.be.greaterThan(0);
			chai.expect(jakku).to.be.greaterThan(0);
			chai.expect(chandrila).to.be.greaterThan(0);
		} catch (e) {
			throw new Error(e.message);
		}
	});
});
