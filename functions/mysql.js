const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/./.env' })

const mysql_host = process.env.MYSQL_HOST
const mysql_username = process.env.MYSQL_USERNAME
const mysql_password = process.env.MYSQL_PASSWORD
const mysql_database = process.env.MYSQL_DATABASE

function db(args) {
  const dbconnect = mysql.createConnection({
    host: mysql_host,
    user: mysql_username,
    password: mysql_password,
    database: mysql_database
  });
  dbconnect.connect(function (err) {
    if (err) throw err;
    console.log("1-DB Connected!");
    dbconnect.query(args, function (err) {
      if (err) throw err;
      console.log("2-DB Added!")
      dbconnect.end();
      console.log("3-DB Closed!")
    })
  })
}
module.exports = db;