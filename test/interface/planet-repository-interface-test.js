const chai = require('chai');
const params = require('../../config/params');
params.dbUrl = params.dbUrl + 'Test';
const mongoose = require('mongoose');
const dbConfig = require('../../config/db');
const swapiService = require('../../service/swapi-service');
const planetRepository = require('../../repository/planet-repository')(swapiService);

describe('Test planet-repository', function() {
	this.timeout(30000);
	let Planet;
	const userId = mongoose.Types.ObjectId();
	const p1 = {
		userId,
		name: 'Tatooine',
		terrain: 'desert',
		weather: 'hot'
	};
	const p2 = {
		userId,
		name: 'Mustafar',
		terrain: 'mountains',
		weather: 'ok'
	};
	const p3 = {
		userId: mongoose.Types.ObjectId(),
		name: 'Kashyyyk',
		terrain: 'jungle, forests, lakes',
		weather: 'tropical'
	};
	before('Sould connet to MongoDB', async () => {
		await Promise.all([dbConfig(), swapiService.getNumberOfFilms('Tatooine')]);
	});
	it('Should create a single planet', async () => {
		const planet = await planetRepository.createPlanet(p1.userId, p1.name, p1.terrain, p1.weather);
		chai.expect(planet.name).to.be.equal(p1.name);
		chai.expect(planet.numberOfFilms).to.be.greaterThan(0);
		p1.id = planet.id;
	});
	it('Should find the planet by id', async () => {
		const planet = await planetRepository.findPlanetById(p1.id);
		chai.expect(planet).exist;
		chai.expect(planet.name).to.be.equal(p1.name);
	});
	it('Should find the planet by his name', async () => {
		const planet = await planetRepository.findPlanetByName(p1.name);
		chai.expect(planet).exist;
		chai.expect(planet.name).to.be.equal(p1.name);
	});
	it('Should create a second and a third planet', async () => {
		let planet = await planetRepository.createPlanet(p2.userId, p2.name, p2.terrain, p2.weather);
		chai.expect(planet).exist;
		p2.id = planet.id;
		planet = await planetRepository.createPlanet(p3.userId, p3.name, p3.terrain, p3.weather);
		p3.id = planet.id;
		chai.expect(planet).exist;
	});
	it('Should get the planets list', async () => {
		const p = await planetRepository.getPlanets(0, 10);
		chai.expect(p.length).to.be.equal(3);
	});
	it('Should get a list with the first 2 planets', async () => {
		const planetsNames = [p1.name, p2.name, p3.name];
		planetsNames.sort();
		const p = await planetRepository.getPlanets(0, 2);
		chai.expect(p.length).to.be.equal(2);
		p.forEach(planet => {
			chai.expect(planet.name).not.be.equal(planetsNames[2]);
		});
	});
	it('Should get a list with the last 2 planets', async () => {
		const planetsNames = [p1.name, p2.name, p3.name];
		planetsNames.sort();
		const p = await planetRepository.getPlanets(1, 2);
		chai.expect(p.length).to.be.equal(2);
		p.forEach(planet => {
			chai.expect(planet.name).not.be.equal(planetsNames[0]);
		});
	});
	it('Should get a planets list by user', async () => {
		const p = await planetRepository.getPlanetsByUser(userId);
		chai.expect(p.length).to.be.equal(2);
		p.forEach(planet => {
			chai.expect([p1.name, p2.name].indexOf(planet.name)).to.be.greaterThan(-1);
		});
	});
	it('Should update a planet data', async () => {
		const newTerrain = 'grass';
		const pOnUpdate = await planetRepository.updatePlanet(p1.id, {
			terrain: newTerrain
		});
		chai.expect(pOnUpdate.terrain).to.be.equal(newTerrain);
		const pOnFind = await planetRepository.findPlanetById(p1.id);
		chai.expect(pOnFind.terrain).to.be.equal(newTerrain);
	});
	it('Should avoid remove the planet with wrong user', async () => {
		const pOnRemove = await planetRepository.removePlanet(p1.id, mongoose.Types.ObjectId());
		chai.expect(pOnRemove).false;
		const pOnFind = await planetRepository.findPlanetById(p1.id);
		chai.expect(pOnFind).exist;
	});
	it('Should remove the planet', async () => {
		const pOnRemove = await planetRepository.removePlanet(p1.id, userId);
		chai.expect(pOnRemove).true;
		const pOnFind = await planetRepository.findPlanetById(p1.id);
		chai.expect(pOnFind).not.exist;
	});
	after('Clean DB and stop the server', async () => {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
	});
});
