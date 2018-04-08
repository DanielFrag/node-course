const tokenUtil = require('../util/token-util');
const stringUtil = require('../util/string-util');
const userRepository = require('../repository/user-repository');

module.exports = {
	async checkAuthToken(req, res, next) {
		const token = req.get('Authorization');
		if (!token) {
			res.set('WWW-Authenticate', 'Bearer token realm="/api/planets"');
			return res.status(401).send('No token provided');
		}
		try {
			const payload = await tokenUtil.verifyToken(token);
			if (!payload || !payload.id || !payload.session) {
				return res.status(400).send('Invalid token');
			}
			const user = await userRepository.findUserById(payload.id);
			if (user.session != payload.session) {
				return res.status(403).send(`Invalid user's session`);
			}
			req.user = user;
			req.updatedToken = await tokenUtil.signToken({
				id: user._id,
				session: user.session
			});
		} catch (e) {
			return res.status(401).send(e.message);
		}
		next();
	},
	async createUser(req, res) {
		const login = req.body.login;
		const password = req.body.password;
		if (!login || !password || typeof login != 'string' || typeof password != 'string') {
			return res.status(400).send('Missing login params');
		}
		const user = await userRepository.findUserByLogin(login);
		if (user) {
			return res.status(409).send(`The user's login already exists`);
		}
		const newUser = await userRepository.createUser(login, password);
		res.set('Location', `/api/users/login?login=${newUser.login}`);
		return res.status(204).send();
	},
	async findLogin(req, res) {
		if (!req.query.login) {
			return res.status(400).send('Missing login param');
		}
		const user = await userRepository.findUserByLogin(req.query.login);
		if (!user) {
			return res.status(404).send('Cannot find the requested login');
		}
		res.status(204).send();
	},
	async login(req, res) {
		if (!(req.body.login && req.body.password)) {
			return res.status(400).send('Missing login params');
		}
		const user = await userRepository.findUserByLogin(req.body.login);
		if (!user) {
			return res.status(404).send('Cannot find the requested login');
		}
		if (user.password != req.body.password) {
			return res.status(401).send('Invalid login or password');
		}
		const session = stringUtil.generateSessionString(8);
		await userRepository.updateUserSession(user._id, session);
		const token = await tokenUtil.signToken({
			id: user._id,
			session
		});
		return res.json({ token });
	},
	async logout(req, res) {
		await userRepository.updateUserSession(req.user._id, stringUtil.generateSessionString(10));
		res.status(204).send();
	},
}