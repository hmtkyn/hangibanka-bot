const axios = require('axios');
const cheerio = require('cheerio');
const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');
const fixNumber = require('../../functions/numberfix');

const b_name = "Türkiye Finans"
const b_slug = "turkiyefinans"
const b_url = "https://www.turkiyefinans.com.tr"
const b_logo = "https://hangibank.com/img/bank/tfkb_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Katılım"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL =
  'https://www.turkiyefinans.com.tr/tr-tr/bireysel/yatirim-hizmetleri/Sayfalar/kiymetli-maden-ve-doviz-fiyatlari.aspx'

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
    TegAction('Hey Profesör! Problem: Türkiye Finans Bankası')
  }
}

async function getTurkiyeFinansBankAlisUSD(html) {
  const $ = cheerio.load(html)
  const TurkiyeFinansBankAlisUSD = $(
    'span#ctl00_ctl38_g_efb80e8c_c74c_4852_9eaf_0d034f0c63a5_kiymetliMadenRepeater_ctl00_buyPriceLbl',
  ).text()
  return TurkiyeFinansBankAlisUSD
}

async function getTurkiyeFinansBankSatisUSD(html) {
  const $ = cheerio.load(html)
  const TurkiyeFinansBankSatisUSD = $(
    'span#ctl00_ctl38_g_efb80e8c_c74c_4852_9eaf_0d034f0c63a5_kiymetliMadenRepeater_ctl00_sellPriceLbl',
  ).text()
  return TurkiyeFinansBankSatisUSD
}

async function getTurkiyeFinansBankUSD() {
  const html = await getHTML(getURL)
  const pTurkiyeFinansBankAlisUSD = await getTurkiyeFinansBankAlisUSD(html)
  const pTurkiyeFinansBankSatisUSD = await getTurkiyeFinansBankSatisUSD(html)

  let bank_usd_buy = fixNumber(pTurkiyeFinansBankAlisUSD)
  let bank_usd_sell = fixNumber(pTurkiyeFinansBankSatisUSD)
  let bank_usd_rate = fixNumber(
    fixNumber(pTurkiyeFinansBankSatisUSD) -
    fixNumber(pTurkiyeFinansBankAlisUSD)
  )

  let create_data = `INSERT INTO realtime_usd (bank_id,usd_buy,usd_sell,usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_usd_buy}','${bank_usd_sell}','${bank_usd_rate}')`

  let update_data = `UPDATE realtime_usd SET usd_buy='${bank_usd_buy}',usd_sell='${bank_usd_sell}',usd_rate='${bank_usd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db.query(update_data, function (error) {
    if (error) throw error;
  })

  console.log('Realtime USD added!')
  console.log(
    `TurkiyeFinansBank - USD = Alış : ${bank_usd_buy} TL / Satış: ${bank_usd_sell} TL`,
  )
}

async function getTurkiyeFinansBankAlisEUR(html) {
  const $ = cheerio.load(html)
  const TurkiyeFinansBankAlisEUR = $(
    'span#ctl00_ctl38_g_efb80e8c_c74c_4852_9eaf_0d034f0c63a5_kiymetliMadenRepeater_ctl11_buyPriceLbl',
  ).text()
  return TurkiyeFinansBankAlisEUR
}

async function getTurkiyeFinansBankSatisEUR(html) {
  const $ = cheerio.load(html)
  const TurkiyeFinansBankSatisEUR = $(
    'span#ctl00_ctl38_g_efb80e8c_c74c_4852_9eaf_0d034f0c63a5_kiymetliMadenRepeater_ctl11_sellPriceLbl',
  ).text()
  return TurkiyeFinansBankSatisEUR
}

async function getTurkiyeFinansBankEUR() {
  const html = await getHTML(getURL)
  const pTurkiyeFinansBankAlisEUR = await getTurkiyeFinansBankAlisEUR(html)
  const pTurkiyeFinansBankSatisEUR = await getTurkiyeFinansBankSatisEUR(html)

  let bank_eur_buy = fixNumber(pTurkiyeFinansBankAlisEUR)
  let bank_eur_sell = fixNumber(pTurkiyeFinansBankSatisEUR)
  let bank_eur_rate = fixNumber(
    fixNumber(pTurkiyeFinansBankSatisEUR) -
    fixNumber(pTurkiyeFinansBankAlisEUR)
  )

  let create_data = `INSERT INTO realtime_eur (bank_id,eur_buy,eur_sell,eur_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eur_buy}','${bank_eur_sell}','${bank_eur_rate}')`

  let update_data = `UPDATE realtime_eur SET eur_buy='${bank_eur_buy}',eur_sell='${bank_eur_sell}',eur_rate='${bank_eur_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db.query(update_data, function (error) {
    if (error) throw error;
  })

  console.log('Realtime EUR added!')
  console.log(
    `TurkiyeFinansBank - EUR = Alış : ${bank_eur_buy} TL / Satış: ${bank_eur_sell} TL`,
  )
}

async function getTurkiyeFinansBankEURUSD() {
  const html = await getHTML(getURL)
  const pTurkiyeFinansBankAlisEUR = await getTurkiyeFinansBankAlisEUR(html)
  const pTurkiyeFinansBankSatisEUR = await getTurkiyeFinansBankSatisEUR(html)
  const pTurkiyeFinansBankAlisUSD = await getTurkiyeFinansBankAlisUSD(html)
  const pTurkiyeFinansBankSatisUSD = await getTurkiyeFinansBankSatisUSD(html)

  let bank_eurusd_buy = fixNumber(
    fixNumber(pTurkiyeFinansBankAlisEUR) /
    fixNumber(pTurkiyeFinansBankAlisUSD)
  )
  let bank_eurusd_sell = fixNumber(
    fixNumber(pTurkiyeFinansBankSatisEUR) /
    fixNumber(pTurkiyeFinansBankSatisUSD)
  )
  let bank_eurusd_rate = fixNumber(
    fixNumber(
      fixNumber(pTurkiyeFinansBankSatisEUR) /
      fixNumber(pTurkiyeFinansBankSatisUSD)
    ) -
    fixNumber(
      fixNumber(pTurkiyeFinansBankAlisEUR) /
      fixNumber(pTurkiyeFinansBankAlisUSD)
    )
  )

  let create_data = `INSERT INTO realtime_eur_usd (bank_id,eur_usd_buy,eur_usd_sell,eur_usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eurusd_buy}','${bank_eurusd_sell}','${bank_eurusd_rate}')`

  let update_data = `UPDATE realtime_eur_usd SET eur_usd_buy='${bank_eurusd_buy}',eur_usd_sell='${bank_eurusd_sell}',eur_usd_rate='${bank_eurusd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db.query(update_data, function (error) {
    if (error) throw error;
  })

  console.log('Realtime EUR/USD added!')
  console.log(
    `TurkiyeFinansBank - EUR/USD = Alış : ${bank_eurusd_buy} $ / Satış: ${bank_eurusd_sell} $`,
  )
}

async function getTurkiyeFinansBankAlisGAU(html) {
  const $ = cheerio.load(html)
  const TurkiyeFinansBankAlisGAU = $(
    'span#ctl00_ctl38_g_efb80e8c_c74c_4852_9eaf_0d034f0c63a5_kiymetliMadenRepeater_ctl14_buyPriceLbl',
  ).text()
  return TurkiyeFinansBankAlisGAU
}

async function getTurkiyeFinansBankSatisGAU(html) {
  const $ = cheerio.load(html)
  const TurkiyeFinansBankSatisGAU = $(
    'span#ctl00_ctl38_g_efb80e8c_c74c_4852_9eaf_0d034f0c63a5_kiymetliMadenRepeater_ctl14_sellPriceLbl',
  ).text()
  return TurkiyeFinansBankSatisGAU
}

async function getTurkiyeFinansBankGAU() {
  const html = await getHTML(getURL)
  const pTurkiyeFinansBankAlisGAU = await getTurkiyeFinansBankAlisGAU(html)
  const pTurkiyeFinansBankSatisGAU = await getTurkiyeFinansBankSatisGAU(html)

  let bank_gau_buy = fixNumber(pTurkiyeFinansBankAlisGAU)
  let bank_gau_sell = fixNumber(pTurkiyeFinansBankSatisGAU)
  let bank_gau_rate = fixNumber(
    fixNumber(pTurkiyeFinansBankSatisGAU) -
    fixNumber(pTurkiyeFinansBankAlisGAU)
  )

  let create_data = `INSERT INTO realtime_gau (bank_id,gau_buy,gau_sell,gau_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_gau_buy}','${bank_gau_sell}','${bank_gau_rate}')`

  let update_data = `UPDATE realtime_gau SET gau_buy='${bank_gau_buy}',gau_sell='${bank_gau_sell}',gau_rate='${bank_gau_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db.query(update_data, function (error) {
    if (error) throw error;
  })

  console.log('Realtime GAU added!')
  console.log(
    `TurkiyeFinansBank - GAU = Alış : ${bank_gau_buy} TL / Satış: ${bank_gau_sell} TL`,
  )
}

function getTurkiyeFinansBankForex() {
  return (
    getTurkiyeFinansBankUSD() +
    getTurkiyeFinansBankEUR() +
    getTurkiyeFinansBankGAU() +
    getTurkiyeFinansBankEURUSD()
  )
}

module.exports = getTurkiyeFinansBankForex;