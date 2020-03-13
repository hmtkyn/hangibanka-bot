const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/./.env' })

const mysql_host = process.env.MYSQL_HOST
const mysql_username = process.env.MYSQL_USERNAME
const mysql_password = process.env.MYSQL_PASSWORD
const mysql_database = process.env.MYSQL_DATABASE

const db = mysql.createPool({
  host: mysql_host,
  user: mysql_username,
  password: mysql_password,
  database: mysql_database,
  acquireTimeout: 30000,
  connectionLimit: 10
});

module.exports = db;