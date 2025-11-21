const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // bbrp layanan cloud (termasuk neon) memerlukan SSL
    ssl:{
        rejectUnauthorized: false
    }
});

module.exports = {query: (text, params) => pool.query(text, params)}