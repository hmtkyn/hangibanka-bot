const axios = require('axios');
const cheerio = require('cheerio');
const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');
const fixNumber = require('../../functions/numberfix');

const b_name = "HalkBank"
const b_slug = "halkbank"
const b_url = "https://www.halkbank.com.tr"
const b_logo = "https://hangibank.com/img/bank/halk_logo.jpg"
const b_type_capital = "Kamu"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL = 'https://www.halkbank.com.tr'

async function getHTML(url) {
  try {
    const { data: html } = await axios({
      method: 'get',
      url: getURL,
      timeout: 5000,
    })
    return html
  } catch (error) {
    TegAction('Hey Profesör! Problem: Halkbank')
  }
}

async function getHalkBankAlisUSD(html) {
  const $ = cheerio.load(html)
  const HalkBankAlisUSD = $(
    'div#tab_ic_piyasa > table > tbody > tr:nth-child(1) > td:nth-child(3)',
  ).text()
  return HalkBankAlisUSD
}

async function getHalkBankSatisUSD(html) {
  const $ = cheerio.load(html)
  const HalkBankSatisUSD = $(
    'div#tab_ic_piyasa > table > tbody > tr:nth-child(1) > td:nth-child(4)',
  ).text()
  return HalkBankSatisUSD
}

async function getHalkBankUSD() {
  const html = await getHTML(getURL)
  const pHalkBankAlisUSD = await getHalkBankAlisUSD(html)
  const pHalkBankSatisUSD = await getHalkBankSatisUSD(html)

  let bank_usd_buy = fixNumber(pHalkBankAlisUSD)
  let bank_usd_sell = fixNumber(pHalkBankSatisUSD)
  let bank_usd_rate = fixNumber(
    fixNumber(pHalkBankSatisUSD) - fixNumber(pHalkBankAlisUSD)
  )

  let create_data = `INSERT INTO realtime_usd (bank_id,usd_buy,usd_sell,usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_usd_buy}','${bank_usd_sell}','${bank_usd_rate}')`

  let update_data = `UPDATE realtime_usd SET usd_buy='${bank_usd_buy}',usd_sell='${bank_usd_sell}',usd_rate='${bank_usd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db.query(update_data, function (error) {
    if (error) throw error;
  })

  console.log('Realtime USD added!')
  console.log(
    `HalkBank - USD = Alış : ${bank_usd_buy} TL / Satış: ${bank_usd_sell} TL`,
  )
}

async function getHalkBankAlisEUR(html) {
  const $ = cheerio.load(html)
  const HalkBankAlisEUR = $(
    'div#tab_ic_piyasa > table > tbody > tr:nth-child(2) > td:nth-child(3)',
  ).text()
  return HalkBankAlisEUR
}

async function getHalkBankSatisEUR(html) {
  const $ = cheerio.load(html)
  const HalkBankSatisEUR = $(
    'div#tab_ic_piyasa > table > tbody > tr:nth-child(2) > td:nth-child(4)',
  ).text()
  return HalkBankSatisEUR
}

async function getHalkBankEUR() {
  const html = await getHTML(getURL)
  const pHalkBankAlisEUR = await getHalkBankAlisEUR(html)
  const pHalkBankSatisEUR = await getHalkBankSatisEUR(html)

  let bank_eur_buy = fixNumber(pHalkBankAlisEUR)
  let bank_eur_sell = fixNumber(pHalkBankSatisEUR)
  let bank_eur_rate = fixNumber(
    fixNumber(pHalkBankSatisEUR) - fixNumber(pHalkBankAlisEUR)
  )

  let create_data = `INSERT INTO realtime_eur (bank_id,eur_buy,eur_sell,eur_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eur_buy}','${bank_eur_sell}','${bank_eur_rate}')`

  let update_data = `UPDATE realtime_eur SET eur_buy='${bank_eur_buy}',eur_sell='${bank_eur_sell}',eur_rate='${bank_eur_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db.query(update_data, function (error) {
    if (error) throw error;
  })

  console.log('Realtime EUR added!')
  console.log(
    `HalkBank - EUR = Alış : ${bank_eur_buy} TL / Satış: ${bank_eur_sell} TL`,
  )
}

async function getHalkBankEURUSD() {
  const html = await getHTML(getURL)
  const pHalkBankAlisEUR = await getHalkBankAlisEUR(html)
  const pHalkBankSatisEUR = await getHalkBankSatisEUR(html)
  const pHalkBankAlisUSD = await getHalkBankAlisUSD(html)
  const pHalkBankSatisUSD = await getHalkBankSatisUSD(html)

  let bank_eurusd_buy = fixNumber(
    fixNumber(pHalkBankAlisEUR) / fixNumber(pHalkBankAlisUSD),
  )
  let bank_eurusd_sell = fixNumber(
    fixNumber(pHalkBankSatisEUR) / fixNumber(pHalkBankSatisUSD),
  )
  let bank_eurusd_rate = fixNumber(
    fixNumber(fixNumber(pHalkBankSatisEUR) / fixNumber(pHalkBankSatisUSD)) -
    fixNumber(fixNumber(pHalkBankAlisEUR) / fixNumber(pHalkBankAlisUSD)),
  )

  let create_data = `INSERT INTO realtime_eur_usd (bank_id,eur_usd_buy,eur_usd_sell,eur_usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eurusd_buy}','${bank_eurusd_sell}','${bank_eurusd_rate}')`

  let update_data = `UPDATE realtime_eur_usd SET eur_usd_buy='${bank_eurusd_buy}',eur_usd_sell='${bank_eurusd_sell}',eur_usd_rate='${bank_eurusd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db.query(update_data, function (error) {
    if (error) throw error;
  })

  console.log('Realtime EUR/USD added!')
  console.log(
    `HalkBank - EUR/USD = Alış : ${bank_eurusd_buy} $ / Satış: ${bank_eurusd_sell} $`,
  )
}

async function getHalkBankAlisGAU(html) {
  const $ = cheerio.load(html)
  const HalkBankAlisGAU = $(
    'div#tab_ic_piyasa > table > tbody > tr:nth-child(4) > td:nth-child(3)',
  ).text()
  return HalkBankAlisGAU
}

async function getHalkBankSatisGAU(html) {
  const $ = cheerio.load(html)
  const HalkBankSatisGAU = $(
    'div#tab_ic_piyasa > table > tbody > tr:nth-child(4) > td:nth-child(4)',
  ).text()
  return HalkBankSatisGAU
}

async function getHalkBankGAU() {
  const html = await getHTML(getURL)
  const pHalkBankAlisGAU = await getHalkBankAlisGAU(html)
  const pHalkBankSatisGAU = await getHalkBankSatisGAU(html)

  let bank_gau_buy = fixNumber(pHalkBankAlisGAU)
  let bank_gau_sell = fixNumber(pHalkBankSatisGAU)
  let bank_gau_rate = fixNumber(
    fixNumber(pHalkBankSatisGAU) - fixNumber(pHalkBankAlisGAU)
  )

  let create_data = `INSERT INTO realtime_gau (bank_id,gau_buy,gau_sell,gau_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_gau_buy}','${bank_gau_sell}','${bank_gau_rate}')`

  let update_data = `UPDATE realtime_gau SET gau_buy='${bank_gau_buy}',gau_sell='${bank_gau_sell}',gau_rate='${bank_gau_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db.query(update_data, function (error) {
    if (error) throw error;
  })

  console.log('Realtime GAU added!')
  console.log(
    `HalkBank - GAU = Alış : ${bank_gau_buy} TL / Satış: ${bank_gau_sell} TL`
  )
}

function getHalkBankForex() {
  return (getHalkBankUSD() + getHalkBankEUR() + getHalkBankGAU() + getHalkBankEURUSD())
}
module.exports = getHalkBankForex;