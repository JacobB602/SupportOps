const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "supportops",
  user: "postgres",
  password: "supportops",
});

module.exports = pool;