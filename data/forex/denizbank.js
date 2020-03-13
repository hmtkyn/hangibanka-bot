const axios = require('axios');
const cheerio = require('cheerio');
const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');
const fixNumber = require('../../functions/numberfix');

const b_name = "Denizbank"
const b_slug = "denizbank"
const b_url = "https://www.denizbank.com"
const b_logo = "https://hangibank.com/img/bank/denizbank_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

const getURL = "https://www.denizbank.com/oran-ve-fiyatlar/denizbank-kur-bilgileri.aspx"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

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
    TegAction('Hey Profesör! Problem: DenizBank')
  }
}

async function getDenizBankAlisUSD(html) {
  const $ = cheerio.load(html)
  const DenizBankAlisUSD = $(
    'table.table > tbody > tr:nth-child(1) > td.right:nth-child(2)',
  ).text()
  return DenizBankAlisUSD
}

async function getDenizBankSatisUSD(html) {
  const $ = cheerio.load(html)
  const DenizBankSatisUSD = $(
    'table.table > tbody > tr:nth-child(1) > td.right:nth-child(3)',
  ).text()
  return DenizBankSatisUSD
}

async function getDenizBankUSD() {
  const html = await getHTML(getURL)
  const pDenizBankAlisUSD = await getDenizBankAlisUSD(html)
  const pDenizBankSatisUSD = await getDenizBankSatisUSD(html)

  let bank_usd_buy = fixNumber(pDenizBankAlisUSD)
  let bank_usd_sell = fixNumber(pDenizBankSatisUSD)
  let bank_usd_rate = fixNumber(
    fixNumber(pDenizBankSatisUSD) - fixNumber(pDenizBankAlisUSD),
  )

  let create_data = `INSERT INTO realtime_usd (bank_id,usd_buy,usd_sell,usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_usd_buy}','${bank_usd_sell}','${bank_usd_rate}')`

  let update_data = `UPDATE realtime_usd SET usd_buy='${bank_usd_buy}',usd_sell='${bank_usd_sell}',usd_rate='${bank_usd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db.query(update_data, function (error) {
    if (error) throw error;
  })

  console.log('Realtime USD added!')
  console.log(
    `DenizBank - USD = Alış : ${bank_usd_buy} TL / Satış: ${bank_usd_rate} TL`,
  )
}

async function getDenizBankAlisEUR(html) {
  const $ = cheerio.load(html)
  const DenizBankAlisEUR = $(
    'table.table > tbody > tr:nth-child(2) > td.right:nth-child(2)',
  ).text()
  return DenizBankAlisEUR
}

async function getDenizBankSatisEUR(html) {
  const $ = cheerio.load(html)
  const DenizBankSatisEUR = $(
    'table.table > tbody > tr:nth-child(2) > td.right:nth-child(3)',
  ).text()
  return DenizBankSatisEUR
}

async function getDenizBankEUR() {
  const html = await getHTML(getURL)
  const pDenizBankAlisEUR = await getDenizBankAlisEUR(html)
  const pDenizBankSatisEUR = await getDenizBankSatisEUR(html)

  let bank_eur_buy = fixNumber(pDenizBankAlisEUR)
  let bank_eur_sell = fixNumber(pDenizBankSatisEUR)
  let bank_eur_rate = fixNumber(
    fixNumber(pDenizBankSatisEUR) - fixNumber(pDenizBankAlisEUR),
  )

  let create_data = `INSERT INTO realtime_eur (bank_id,eur_buy,eur_sell,eur_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eur_buy}','${bank_eur_sell}','${bank_eur_rate}')`

  let update_data = `UPDATE realtime_eur SET eur_buy='${bank_eur_buy}',eur_sell='${bank_eur_sell}',eur_rate='${bank_eur_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db.query(update_data, function (error) {
    if (error) throw error;
  })

  console.log('Realtime EUR added!')
  console.log(
    `DenizBank - EUR = Alış : ${bank_eur_buy} TL / Satış: ${bank_eur_sell} TL`,
  )
}

async function getDenizBankEURUSD() {
  const html = await getHTML(getURL)
  const pDenizBankAlisEUR = await getDenizBankAlisEUR(html)
  const pDenizBankSatisEUR = await getDenizBankSatisEUR(html)
  const pDenizBankAlisUSD = await getDenizBankAlisUSD(html)
  const pDenizBankSatisUSD = await getDenizBankSatisUSD(html)

  let bank_eurusd_buy = fixNumber(
    fixNumber(pDenizBankAlisEUR) / fixNumber(pDenizBankAlisUSD),
  )
  let bank_eurusd_sell = fixNumber(
    fixNumber(pDenizBankSatisEUR) / fixNumber(pDenizBankSatisUSD),
  )
  let bank_eurusd_rate = fixNumber(
    fixNumber(fixNumber(pDenizBankSatisEUR) / fixNumber(pDenizBankSatisUSD)) -
    fixNumber(fixNumber(pDenizBankAlisEUR) / fixNumber(pDenizBankAlisUSD)),
  )

  let create_data = `INSERT INTO realtime_eur_usd (bank_id,eur_usd_buy,eur_usd_sell,eur_usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eurusd_buy}','${bank_eurusd_sell}','${bank_eurusd_rate}')`

  let update_data = `UPDATE realtime_eur_usd SET eur_usd_buy='${bank_eurusd_buy}',eur_usd_sell='${bank_eurusd_sell}',eur_usd_rate='${bank_eurusd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db.query(update_data, function (error) {
    if (error) throw error;
  })

  console.log('Realtime EUR/USD added!')
  console.log(
    `DenizBank - EUR/USD = Alış : ${bank_eurusd_buy} TL / Satış: ${bank_eurusd_sell} TL`,
  )
}

async function getDenizBankAlisGAU(html) {
  const $ = cheerio.load(html)
  const DenizBankAlisGAU = $(
    'table.table > tbody > tr:nth-child(13) > td.right:nth-child(2)',
  ).text()
  return DenizBankAlisGAU
}

async function getDenizBankSatisGAU(html) {
  const $ = cheerio.load(html)
  const DenizBankSatisGAU = $(
    'table.table > tbody > tr:nth-child(13) > td.right:nth-child(3)',
  ).text()
  return DenizBankSatisGAU
}

async function getDenizBankGAU() {
  const html = await getHTML(getURL)
  const pDenizBankAlisGAU = await getDenizBankAlisGAU(html)
  const pDenizBankSatisGAU = await getDenizBankSatisGAU(html)

  let bank_gau_buy = fixNumber(pDenizBankAlisGAU)
  let bank_gau_sell = fixNumber(pDenizBankSatisGAU)
  let bank_gau_rate = fixNumber(
    fixNumber(pDenizBankSatisGAU) - fixNumber(pDenizBankAlisGAU)
  )

  let create_data = `INSERT INTO realtime_gau (bank_id,gau_buy,gau_sell,gau_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_gau_buy}','${bank_gau_sell}','${bank_gau_rate}')`

  let update_data = `UPDATE realtime_gau SET gau_buy='${bank_gau_buy}',gau_sell='${bank_gau_sell}',gau_rate='${bank_gau_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db.query(update_data, function (error) {
    if (error) throw error;
  })

  console.log('Realtime GAU added!')
  console.log(
    `DenizBank - GAU = Alış : ${bank_gau_buy} TL / Satış: ${bank_gau_sell} TL`,
  )
}

function getDenizBankForex() {
  return (
    getDenizBankUSD() +
    getDenizBankEUR() +
    getDenizBankGAU() +
    getDenizBankEURUSD()
  )
}

module.exports = getDenizBankForex;