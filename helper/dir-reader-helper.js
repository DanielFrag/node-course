const fs = require('fs');
const { join } = require('path');

module.exports = (relativeRootPath, data) => {
	const routesPath = join(__dirname, `../${relativeRootPath}`);
	fs.readdirSync(routesPath).forEach(file => {
		const requiredModule = require(join(routesPath, `/${file}`));
		if (!requiredModule) {
			return;
		}
		if (typeof requiredModule == 'function') {
			requiredModule(data);
		}
	});
};
