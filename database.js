const Pool = require('pg').Pool;
const pool = new Pool({
 user: "postgres",
 //change whatever pasw you have
 password: "password",
 //change whatever database name you have
 database: "wad21_hw4",
 host: "localhost",
 port: "5432"
});
module.exports = pool;