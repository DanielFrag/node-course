const { tokenSecret, tokenExp } = require('../config/params');
const jwt = require('jsonwebtoken');

module.exports = {
	async verifyToken(token) {
		return new Promise((resolve, reject) => {
			jwt.verify(token, tokenSecret, (verifyError, decoded) => {
				if (verifyError) {
					reject(verifyError);
					return;
				}
				resolve(decoded);
			});
		});
	},
	async signToken(payload) {
		return new Promise((resolve, reject) => {
			jwt.sign(payload, tokenSecret, {
				expiresIn: tokenExp
			}, (signError, token) => {
				if (signError) {
					reject(signError);
					return;
				}
				resolve(token);
			});
		});
	}
}