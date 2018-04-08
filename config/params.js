module.exports = {
    port: process.env.PORT || 8080,
    dbUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/planetsApi',
    tokenSecret: process.env.TOKEN_SECRET || 'sEcrEt',
    tokenExp: process.env.TOKEN_EXP || '600'
}