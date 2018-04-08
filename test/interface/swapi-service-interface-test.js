const chai = require('chai');
const swapiService = require('../../service/swapi-service');

describe('Request util teste', function() {
	this.timeout(30000);
	it('Should request some planets', async () => {
		try {
			const tatooine = await swapiService.getPlanetByName('Tatooine');
			console.log(tatooine);
			const jakku = await swapiService.getPlanetByName('Jakku');
			console.log(jakku);
			const chandrila = await swapiService.getPlanetByName('Chandrila');
			console.log(chandrila);
			chai.expect(tatooine).exist;
			chai.expect(jakku).exist;
			chai.expect(chandrila).exist;
		} catch (e) {
			throw new Error(e.message);
		}
	});
});
