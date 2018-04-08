const configApp = require('./config/app.js');

async function startServer () {
    const app = await configApp();
    app.listen(app.get('port'), () => {
        console.log(app.get('port'));
    });
    return app;
}

module.exports = startServer();