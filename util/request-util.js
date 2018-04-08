const request = require('request');
module.exports = (url, method, headers, body) => {
	return new Promise((resolve, reject) => {
		request(url, {
			body,
			headers,
			json:true,
			method
		}, (err, res, resBody) => {
			if (err) {
				reject(err);
				return;
			}
			resolve({
				body: resBody,
				headers: res.headers,
				statusCode: res.statusCode,
				statusMessage: res.statusMessage
			});
		});
	});
};