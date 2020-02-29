const axios = require('axios');
const cheerio = require('cheerio');
const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');
const fixNumber = require('../../functions/numberfix');

const b_name = "ŞekerBank"
const b_slug = "sekerbank"
const b_url = "https://www.sekerbank.com.tr"
const b_logo = "https://hangibank.com/assets/img/bank/seker_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL =
  'https://sube.sekerbank.com.tr/web/servlet/SekerbankServlet?service=SBkurlarOranlar.ButundovizKurlariListele&DISKURUM=ODC'

async function getHTML(url) {
  try {
    const { data: html } = await axios({
      method: 'get',
      url: getURL,
      timeout: 5000,
    })
    return html
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: ŞekerBank')
  }
}

async function getSekerBankAlisUSD(html) {
  const $ = cheerio.load(html)
  const SekerBankAlisUSD = $(
    'body > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2)',
  ).html()
  return SekerBankAlisUSD
}

async function getSekerBankSatisUSD(html) {
  const $ = cheerio.load(html)
  const SekerBankSatisUSD = $(
    'body > div > div > table > tbody > tr:nth-child(2) > td:nth-child(3)',
  ).html()
  return SekerBankSatisUSD
}

async function getSekerBankUSD() {
  const html = await getHTML(getURL)
  const pSekerBankAlisUSD = await getSekerBankAlisUSD(html)
  const pSekerBankSatisUSD = await getSekerBankSatisUSD(html)

  let bank_usd_buy = fixNumber(pSekerBankAlisUSD)
  let bank_usd_sell = fixNumber(pSekerBankSatisUSD)
  let bank_usd_rate = fixNumber(
    fixNumber(pSekerBankSatisUSD) - fixNumber(pSekerBankAlisUSD)
  )

  let create_data = `INSERT INTO realtime_usd (bank_id,usd_buy,usd_sell,usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_usd_buy}','${bank_usd_sell}','${bank_usd_rate}')`

  let update_data = `UPDATE realtime_usd SET usd_buy='${bank_usd_buy}',usd_sell='${bank_usd_sell}',usd_rate='${bank_usd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime USD added!')
  console.log(
    `SekerBank - USD = Alış : ${bank_usd_buy} TL / Satış: ${bank_usd_sell} TL`,
  )
}

async function getSekerBankAlisEUR(html) {
  const $ = cheerio.load(html)
  const SekerBankAlisEUR = $(
    'body > div > div > table > tbody > tr:nth-child(3) > td:nth-child(2)',
  ).html()
  return SekerBankAlisEUR
}

async function getSekerBankSatisEUR(html) {
  const $ = cheerio.load(html)
  const SekerBankSatisEUR = $(
    'body > div > div > table > tbody > tr:nth-child(3) > td:nth-child(3)',
  ).html()
  return SekerBankSatisEUR
}

async function getSekerBankEUR() {
  const html = await getHTML(getURL)
  const pSekerBankAlisEUR = await getSekerBankAlisEUR(html)
  const pSekerBankSatisEUR = await getSekerBankSatisEUR(html)

  let bank_eur_buy = fixNumber(pSekerBankAlisEUR)
  let bank_eur_sell = fixNumber(pSekerBankSatisEUR)
  let bank_eur_rate = fixNumber(
    fixNumber(pSekerBankSatisEUR) - fixNumber(pSekerBankAlisEUR)
  )

  let create_data = `INSERT INTO realtime_eur (bank_id,eur_buy,eur_sell,eur_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eur_buy}','${bank_eur_sell}','${bank_eur_rate}')`

  let update_data = `UPDATE realtime_eur SET eur_buy='${bank_eur_buy}',eur_sell='${bank_eur_sell}',eur_rate='${bank_eur_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime EUR added!')
  console.log(
    `SekerBank - EUR = Alış : ${bank_eur_buy} TL / Satış: ${bank_eur_sell} TL`,
  )
}

async function getSekerBankEURUSD() {
  const html = await getHTML(getURL)
  const pSekerBankAlisEUR = await getSekerBankAlisEUR(html)
  const pSekerBankSatisEUR = await getSekerBankSatisEUR(html)
  const pSekerBankAlisUSD = await getSekerBankAlisUSD(html)
  const pSekerBankSatisUSD = await getSekerBankSatisUSD(html)

  let bank_eurusd_buy = fixNumber(
    fixNumber(pSekerBankAlisEUR) / fixNumber(pSekerBankAlisUSD)
  )
  let bank_eurusd_sell = fixNumber(
    fixNumber(pSekerBankSatisEUR) / fixNumber(pSekerBankSatisUSD)
  )
  let bank_eurusd_rate = fixNumber(
    fixNumber(fixNumber(pSekerBankSatisEUR) / fixNumber(pSekerBankSatisUSD)) -
    fixNumber(fixNumber(pSekerBankAlisEUR) / fixNumber(pSekerBankAlisUSD))
  )

  let create_data = `INSERT INTO realtime_eur_usd (bank_id,eur_usd_buy,eur_usd_sell,eur_usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eurusd_buy}','${bank_eurusd_sell}','${bank_eurusd_rate}')`

  let update_data = `UPDATE realtime_eur_usd SET eur_usd_buy='${bank_eurusd_buy}',eur_usd_sell='${bank_eurusd_sell}',eur_usd_rate='${bank_eurusd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime EUR/USD added!')
  console.log(
    `SekerBank - EUR/USD = Alış : ${bank_eurusd_buy} $ / Satış: ${bank_eurusd_sell} $`,
  )
}

function getSekerBankForex() {
  return (getSekerBankUSD() + getSekerBankEUR() + getSekerBankEURUSD() + db(update_sql))
}

module.exports = getSekerBankForex;