const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Medicinal_hub',
    password: 'Mn2004',
    port: 5432,
});

module.exports = pool;
