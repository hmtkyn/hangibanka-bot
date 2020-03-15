const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./functions/mysql');
const Forex = require('./data/forex');
const Interest = require('./data/interest');
const Profit = require('./data/profit');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'assets')));
// app.use(express.static('assets'))

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

Forex();
Interest();
Profit();

app.get('/', function (req, res, next) {
  res.render('index');
});

// REAL-TIME START
app.get('/usd', (req, res) => {

  let sql = `SELECT * FROM realtime_usd LEFT JOIN bank_list ON realtime_usd.bank_id = bank_list.bank_id ORDER BY ABS(usd_rate) DESC`;

  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/eur', (req, res) => {

  let sql = `SELECT * FROM realtime_eur LEFT JOIN bank_list ON realtime_eur.bank_id = bank_list.bank_id ORDER BY ABS(eur_rate) DESC`;

  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/eur-usd', (req, res) => {

  let sql = `SELECT * FROM realtime_eur_usd LEFT JOIN bank_list ON realtime_eur_usd.bank_id = bank_list.bank_id ORDER BY ABS(eur_usd_rate) DESC`;

  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/gau', (req, res) => {

  let sql = `SELECT * FROM realtime_gau LEFT JOIN bank_list ON realtime_gau.bank_id = bank_list.bank_id ORDER BY ABS(gau_rate) DESC`;

  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/interest', (req, res) => {

  let sql = `SELECT * FROM realtime_interest LEFT JOIN bank_list ON realtime_interest.bank_id = bank_list.bank_id ORDER BY ABS(interest_rate) DESC`;

  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/profit', (req, res) => {

  let sql = `SELECT * FROM realtime_profit LEFT JOIN bank_list ON realtime_profit.bank_id = bank_list.bank_id ORDER BY ABS(profit_share_rate) DESC`;

  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

// REAL TIME END

// REAL TIME SINGLE BANK START
app.get('/usd/:bank_slug', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM realtime_usd,bank_list WHERE realtime_usd.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/eur/:bank_slug', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM realtime_eur,bank_list WHERE realtime_eur.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/eur-usd/:bank_slug', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM realtime_eur_usd,bank_list WHERE realtime_eur_usd.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/gau/:bank_slug', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM realtime_gau,bank_list WHERE realtime_gau.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/interest/:bank_slug', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM realtime_interest,bank_list WHERE realtime_interest.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/profit/:bank_slug', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM realtime_profit,bank_list WHERE realtime_profit.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

// REAL TIME SINGLE BANK END

// ARCHIVE SINGLE BANK START
app.get('/usd/:bank_slug/archive', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_usd,bank_list WHERE archive_usd.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/usd/:bank_slug/archive/lastday', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_usd,bank_list WHERE archive_usd.bank_id = bank_list.bank_id AND usd_update >= NOW() - INTERVAL 1 day AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/usd/:bank_slug/archive/lastweek', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_usd,bank_list WHERE archive_usd.bank_id = bank_list.bank_id AND usd_update >= DATE(NOW()) - INTERVAL 7 day AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/usd/:bank_slug/archive/lastmonth', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_usd,bank_list WHERE archive_usd.bank_id = bank_list.bank_id AND usd_update >= NOW() - INTERVAL 1 month AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/usd/:bank_slug/archive/lastyear', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_usd,bank_list WHERE archive_usd.bank_id = bank_list.bank_id AND usd_update >= NOW() - INTERVAL 1 year AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/eur/:bank_slug/archive', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_eur,bank_list WHERE archive_eur.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/eur/:bank_slug/archive/lastday', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_eur,bank_list WHERE archive_eur.bank_id = bank_list.bank_id AND eur_update >= NOW() - INTERVAL 1 day AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/eur/:bank_slug/archive/lastweek', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_eur,bank_list WHERE archive_eur.bank_id = bank_list.bank_id AND eur_update >= DATE(NOW()) - INTERVAL 7 day AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/eur/:bank_slug/archive/lastmonth', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_eur,bank_list WHERE archive_eur.bank_id = bank_list.bank_id AND eur_update >= NOW() - INTERVAL 1 month AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/eur/:bank_slug/archive/lastyear', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_eur,bank_list WHERE archive_eur.bank_id = bank_list.bank_id AND eur_update >= NOW() - INTERVAL 1 year AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/eur-usd/:bank_slug/archive', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_eur_usd,bank_list WHERE archive_eur_usd.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/eur-usd/:bank_slug/archive/lastday', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_eur_usd,bank_list WHERE archive_eur_usd.bank_id = bank_list.bank_id AND eur_usd_update >= NOW() - INTERVAL 1 day AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/eur-usd/:bank_slug/archive/lastweek', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_eur_usd,bank_list WHERE archive_eur_usd.bank_id = bank_list.bank_id AND eur_usd_update >= DATE(NOW()) - INTERVAL 7 DAY AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/eur-usd/:bank_slug/archive/lastmonth', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_eur_usd,bank_list WHERE archive_eur_usd.bank_id = bank_list.bank_id AND eur_usd_update >= NOW() - INTERVAL 1 month AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/eur-usd/:bank_slug/archive/lastyear', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_eur_usd,bank_list WHERE archive_uer_usd.bank_id = bank_list.bank_id AND eur_usd_update >= NOW() - INTERVAL 1 year AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/gau/:bank_slug/archive', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_gau,bank_list WHERE archive_gau.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/gau/:bank_slug/archive/lastday', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_gau,bank_list WHERE archive_gau.bank_id = bank_list.bank_id AND gau_update >= NOW() - INTERVAL 1 day AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/gau/:bank_slug/archive/lastweek', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_gau,bank_list WHERE archive_gau.bank_id = bank_list.bank_id AND gau_update >= DATE(NOW()) - INTERVAL 7 DAY AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/gau/:bank_slug/archive/lastmonth', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_gau,bank_list WHERE archive_gau.bank_id = bank_list.bank_id AND gau_update >= NOW() - INTERVAL 1 month AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/gau/:bank_slug/archive/lastyear', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_gau,bank_list WHERE archive_gau.bank_id = bank_list.bank_id AND gau_update >= NOW() - INTERVAL 1 year AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/interest/:bank_slug/archive', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_interest,bank_list WHERE archive_interest.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/interest/:bank_slug/archive/lastday', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_interest,bank_list WHERE archive_interest.bank_id = bank_list.bank_id AND interest_update >= NOW() - INTERVAL 1 day AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/interest/:bank_slug/archive/lastweek', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_interest,bank_list WHERE archive_interest.bank_id = bank_list.bank_id AND interest_update >= DATE(NOW()) - INTERVAL 7 DAY AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/interest/:bank_slug/archive/lastmonth', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_interest,bank_list WHERE archive_interest.bank_id = bank_list.bank_id AND interest_update >= NOW() - INTERVAL 1 month AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/interest/:bank_slug/archive/lastyear', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_interest,bank_list WHERE archive_interest.bank_id = bank_list.bank_id AND interest_update >= NOW() - INTERVAL 1 year AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/profit/:bank_slug/archive', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_profit,bank_list WHERE archive_profit.bank_id = bank_list.bank_id AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/profit/:bank_slug/archive/lastday', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_profit,bank_list WHERE archive_profit.bank_id = bank_list.bank_id AND profit_update >= NOW() - INTERVAL 1 day AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/profit/:bank_slug/archive/lastweek', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_profit,bank_list WHERE archive_profit.bank_id = bank_list.bank_id AND profit_update >= DATE(NOW()) - INTERVAL 7 DAY AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/profit/:bank_slug/archive/lastmonth', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_profit,bank_list WHERE archive_profit.bank_id = bank_list.bank_id AND profit_update >= NOW() - INTERVAL 1 month AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

app.get('/profit/:bank_slug/archive/lastyear', (req, res) => {

  let bankSlug = req.params.bank_slug;

  let sql = `SELECT * FROM archive_profit,bank_list WHERE archive_profit.bank_id = bank_list.bank_id AND profit_update >= NOW() - INTERVAL 1 year AND bank_list.bank_slug=?`;

  let query = db.query(sql, [bankSlug], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });

})

// ARCHIVE SINGLE BANK END

module.exports = app;