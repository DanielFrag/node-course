module.exports = {
    port: process.env.PORT || 8080,
    dbUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/planetsApi',
    swapiCacheExpiresIn: parseInt(process.env.SW_CACHE_EXP) || 600,
    tokenSecret: process.env.TOKEN_SECRET || 'sEcrEt',
    tokenExp: parseInt(process.env.TOKEN_EXP) || 600
}