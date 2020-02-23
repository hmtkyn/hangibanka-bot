import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mysql from 'mysql'
import dotenv from 'dotenv'
import goCron from './data'

dotenv.config({ path: __dirname + '/functions/.env' })

const mysql_host = process.env.MYSQL_HOST
const mysql_username = process.env.MYSQL_USERNAME
const mysql_password = process.env.MYSQL_PASSWORD
const mysql_database = process.env.MYSQL_DATABASE

const dbconnect = mysql.createConnection({
  host: mysql_host,
  user: mysql_username,
  password: mysql_password,
  database: mysql_database
});

const app = express();

goCron();
app.use(bodyParser.json());
app.use(cors());

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// REAL-TIME START
app.get('/usd', (req, res) => {
  let sql = `SELECT * FROM realtime_usd LEFT JOIN bank_list ON realtime_usd.bank_id = bank_list.bank_id`;
  let query = dbconnect.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
})

app.get('/eur', (req, res) => {
  let sql = `SELECT * FROM realtime_eur LEFT JOIN bank_list ON realtime_eur.bank_id = bank_list.bank_id`;
  let query = dbconnect.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
})

app.get('/eur-usd', (req, res) => {
  let sql = `SELECT * FROM realtime_eur_usd LEFT JOIN bank_list ON realtime_eur_usd.bank_id = bank_list.bank_id`;
  let query = dbconnect.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
})

app.get('/gau', (req, res) => {
  let sql = `SELECT * FROM realtime_gau LEFT JOIN bank_list ON realtime_gau.bank_id = bank_list.bank_id`;
  let query = dbconnect.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
})
// REAL TIME END

// REAL TIME SINGLE BANK START
app.get('/usd/:bank_slug', (req, res) => {
  let bankSlug = req.params.bank_slug;
  let sql = `SELECT * FROM realtime_usd,bank_list WHERE realtime_usd.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;
  let query = dbconnect.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
})

app.get('/eur/:bank_slug', (req, res) => {
  let bankSlug = req.params.bank_slug;
  let sql = `SELECT * FROM realtime_eur,bank_list WHERE realtime_eur.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;
  let query = dbconnect.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
})

app.get('/eur-usd/:bank_slug', (req, res) => {
  let bankSlug = req.params.bank_slug;
  let sql = `SELECT * FROM realtime_eur_usd,bank_list WHERE realtime_eur_usd.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;
  let query = dbconnect.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
})

app.get('/gau/:bank_slug', (req, res) => {
  let bankSlug = req.params.bank_slug;
  let sql = `SELECT * FROM realtime_gau,bank_list WHERE realtime_gau.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;
  let query = dbconnect.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
})
// REAL TIME SINGLE BANK END

// ARCHIVE SINGLE BANK START
app.get('/usd/:bank_slug/archive', (req, res) => {
  let bankSlug = req.params.bank_slug;
  let sql = `SELECT * FROM archive_usd,bank_list WHERE archive_usd.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;
  let query = dbconnect.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
})

app.get('/eur/:bank_slug/archive', (req, res) => {
  let bankSlug = req.params.bank_slug;
  let sql = `SELECT * FROM archive_eur,bank_list WHERE archive_eur.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;
  let query = dbconnect.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
})

app.get('/eur-usd/:bank_slug/archive', (req, res) => {
  let bankSlug = req.params.bank_slug;
  let sql = `SELECT * FROM archive_eur_usd,bank_list WHERE archive_eur_usd.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;
  let query = dbconnect.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
})

app.get('/gau/:bank_slug/archive', (req, res) => {
  let bankSlug = req.params.bank_slug;
  let sql = `SELECT * FROM archive_gau,bank_list WHERE archive_gau.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;
  let query = dbconnect.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
})
// ARCHIVE SINGLE BANK END

export default app