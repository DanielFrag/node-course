const params = require('../config/params');
params.dbUrl = params.dbUrl + 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const mongoose = require('mongoose');

describe('User routes', function() {
	this.timeout(30000);
	const user1 = {
		login: 'first',
		password: 'foo',
		token: ''
	};
	const user2 = {
		login: 'second',
		password: 'bar',
		token: ''
	};
	let auxToken;
	let server;
	before('Start server', async () => {
		server = await require('../server');
	});
	it('Should not find a nonexistent user', (done) => {
		chai
			.request(server)
			.get(`/api/user/login?login=${user1.login}`)
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				chai.expect(res.status).to.be.equal(404);
				done();
			});
	});
	it(`Should not create a new user without the user's params`, (done) => {
		chai
			.request(server)
			.post(`/api/user`)
			.send({})
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				chai.expect(res.status).to.be.equal(400);
				done();
			});
	});
	it('Should create a new user', (done) => {
		chai
			.request(server)
			.post(`/api/user`)
			.send({
				login: user1.login,
				password: user1.password
			})
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				chai.expect(res.status).to.be.equal(204);
				done();
			});
	});
	it(`Should reject the query for an user's login without the "login" url query param`, (done) => {
		chai
			.request(server)
			.get(`/api/user/login`)
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				chai.expect(res.status).to.be.equal(400);
				done();
			});
	});
	it('Should find an existent user', (done) => {
		chai
			.request(server)
			.get(`/api/user/login?login=${user1.login}`)
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				chai.expect(res.status).to.be.equal(204);
				done();
			});
	});
	it('Should not create a new user with an existent login', (done) => {
		chai
			.request(server)
			.post(`/api/user`)
			.send({
				login: user1.login,
				password: user1.password
			})
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				chai.expect(res.status).to.be.equal(409);
				done();
			});
	});
	it('Should not authenticate the user without the login params', (done) => {
		chai
			.request(server)
			.post('/api/user/login')
			.send({
				login: user1.login
			})
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				chai.expect(res.status).to.be.equal(400);
				chai.expect(res.body.token).not.exist;
				done();
			});
	});
	it('Should not authenticate a nonexistent user', (done) => {
		chai
			.request(server)
			.post('/api/user/login')
			.send({
				login: user2.login,
				password: user2.password
			})
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				chai.expect(res.status).to.be.equal(404);
				chai.expect(res.body.token).not.exist;
				done();
			});
	});
	it('Should not authenticate the user with an invalid password', (done) => {
		chai
			.request(server)
			.post('/api/user/login')
			.send({
				login: user1.login,
				password: user2.password
			})
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				chai.expect(res.status).to.be.equal(401);
				chai.expect(res.body.token).not.exist;
				done();
			});
	});
	it('Should authenticate the user', (done) => {
		chai
			.request(server)
			.post('/api/user/login')
			.send({
				login: user1.login,
				password: user1.password
			})
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				chai.expect(res.status).to.be.equal(200);
				chai.expect(res.body.token).exist;
				user1.token = res.body.token;
				done();
			});
	});
	it('Should authenticate the user an invalidate the previous token', (done) => {
		auxToken = user1.token;
		chai
			.request(server)
			.post('/api/user/login')
			.send({
				login: user1.login,
				password: user1.password
			})
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				chai.expect(res.status).to.be.equal(200);
				chai.expect(res.body.token).exist;
				user1.token = res.body.token;
				done();
			});
	});
	it('Should prevent the logout without the token header param', (done) => {
		chai
			.request(server)
			.post('/api/user/logout')
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				chai.expect(res.status).to.be.equal(401);
				chai.expect(res).to.have.header('WWW-Authenticate');
				done();
			});
	});
	it('Should prevent the logout with the wrong token header param', (done) => {
		chai
			.request(server)
			.post('/api/user/logout')
			.set('Authorization', auxToken)
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				chai.expect(res.status).to.be.equal(403);
				done();
			});
	});
	it('Should logout user', (done) => {
		chai
			.request(server)
			.post('/api/user/logout')
			.set('Authorization', user1.token)
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				chai.expect(res.status).to.be.equal(204);
				done();
			});
	});
	after('Clean DB and stop the server', async () => {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
	});
});