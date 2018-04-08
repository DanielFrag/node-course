const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
	async createUser(login, password) {
		return User.create({
			login,
			password
		});
	},
	async findUserById(userId) {
		return User
			.findById(userId)
			.lean();
	},
	async findUserByLogin(userLogin) {
		return User
			.findOne({
				login: userLogin
			})
			.lean();
	},
	async updateUserSession(userId, session) {
		return User
			.findByIdAndUpdate(userId, {
				session
			}, {
				new: true
			})
			.lean();
	}
};
