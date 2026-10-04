const {Pool} = require("pg")

const pool = new Pool ({
    host: "localhost",
    database: "sentinel",
    user: "sentinel_app",
    password: process.env.SENTINEL_DB_PASSWORD,
    port: 5432
});

module.exports = pool;