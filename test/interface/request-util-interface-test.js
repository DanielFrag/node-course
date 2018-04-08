const chai = require('chai');
const requestUtils = require('../../util/request-util');

describe('Request util teste', function() {
	this.timeout(10000);
	const swapiBaseUrl = 'https://swapi.co/';
	it('Should request the star wars planets', async () => {
		try {
			const res = await requestUtils(`${swapiBaseUrl}/api/planets/3`, 'GET');
			chai.expect(res.body).exist;
			chai.expect(res.statusCode).exist;
			chai.expect(res.statusMessage).exist;
			chai.expect(res.headers).exist;
		} catch (e) {
			throw new Error(e.message);
		}
	});
});
