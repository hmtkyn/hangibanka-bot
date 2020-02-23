import axios from 'axios'
import cheerio from 'cheerio'
import TegAction from '../functions/telegram'
import db from './../functions/mysql'
import fixNumber from '../functions/numberfix'

const b_name = "ZiraatBank"
const b_slug = "ziraatbank"
const b_url = "https://www.ziraatbank.com.tr"
const b_logo = "https://hangibank.com/assets/img/bank/ziraat_logo.jpg"
const b_type_capital = "Kamu"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL = 'https://www.ziraatbank.com.tr/tr/fiyatlar-ve-oranlar'

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
    TegAction('Hey Profesör! Problem: Ziraat Bankası')
  }
}

async function getZiraatBankAlisUSD(html) {
  const $ = cheerio.load(html)
  const ZiraatBankAlisUSD = $(
    'div#result-dovizkur > .js-item:not(.hide) > div.table > table > tbody > tr:nth-child(1) > td:nth-child(3)',
  ).text()
  return ZiraatBankAlisUSD
}

async function getZiraatBankSatisUSD(html) {
  const $ = cheerio.load(html)
  const ZiraatBankSatisUSD = $(
    'div#result-dovizkur > .js-item:not(.hide) > div.table > table > tbody > tr:nth-child(1) > td:nth-child(4)',
  ).text()
  return ZiraatBankSatisUSD
}

export async function getZiraatBankUSD() {
  const html = await getHTML(getURL)
  const pZiraatBankAlisUSD = await getZiraatBankAlisUSD(html)
  const pZiraatBankSatisUSD = await getZiraatBankSatisUSD(html)

  let bank_usd_buy = fixNumber(pZiraatBankAlisUSD)
  let bank_usd_sell = fixNumber(pZiraatBankSatisUSD)
  let bank_usd_rate = fixNumber(
    fixNumber(pZiraatBankSatisUSD) - fixNumber(pZiraatBankAlisUSD)
  )

  let create_data = `INSERT INTO realtime_usd (bank_id,usd_buy,usd_sell,usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_usd_buy}','${bank_usd_sell}','${bank_usd_rate}')`

  let update_data = `UPDATE realtime_usd SET usd_buy='${bank_usd_buy}',usd_sell='${bank_usd_sell}',usd_rate='${bank_usd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime USD added!')
  console.log(
    `ZiraatBank - USD = Alış : ${bank_usd_buy} TL / Satış: ${bank_usd_sell} TL`,
  )
}

async function getZiraatBankAlisEUR(html) {
  const $ = cheerio.load(html)
  const ZiraatBankAlisEUR = $(
    'div#result-dovizkur > .js-item:not(.hide) > div.table > table > tbody > tr:nth-child(2) > td:nth-child(3)',
  ).text()
  return ZiraatBankAlisEUR
}

async function getZiraatBankSatisEUR(html) {
  const $ = cheerio.load(html)
  const ZiraatBankSatisEUR = $(
    'div#result-dovizkur > .js-item:not(.hide) > div.table > table > tbody > tr:nth-child(2) > td:nth-child(4)',
  ).text()
  return ZiraatBankSatisEUR
}

export async function getZiraatBankEUR() {
  const html = await getHTML(getURL)
  const pZiraatBankAlisEUR = await getZiraatBankAlisEUR(html)
  const pZiraatBankSatisEUR = await getZiraatBankSatisEUR(html)

  let bank_eur_buy = fixNumber(pZiraatBankAlisEUR)
  let bank_eur_sell = fixNumber(pZiraatBankSatisEUR)
  let bank_eur_rate = fixNumber(
    fixNumber(pZiraatBankSatisEUR) - fixNumber(pZiraatBankAlisEUR)
  )

  let create_data = `INSERT INTO realtime_eur (bank_id,eur_buy,eur_sell,eur_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eur_buy}','${bank_eur_sell}','${bank_eur_rate}')`

  let update_data = `UPDATE realtime_eur SET eur_buy='${bank_eur_buy}',eur_sell='${bank_eur_sell}',eur_rate='${bank_eur_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime EUR added!')
  console.log(
    `ZiraatBank - EUR = Alış : ${bank_eur_buy} TL / Satış: ${bank_eur_sell} TL`,
  )
}

export async function getZiraatBankEURUSD() {
  const html = await getHTML(getURL)
  const pZiraatBankAlisEUR = await getZiraatBankAlisEUR(html)
  const pZiraatBankSatisEUR = await getZiraatBankSatisEUR(html)
  const pZiraatBankAlisUSD = await getZiraatBankAlisUSD(html)
  const pZiraatBankSatisUSD = await getZiraatBankSatisUSD(html)

  let bank_eurusd_buy = fixNumber(
    fixNumber(pZiraatBankAlisEUR) / fixNumber(pZiraatBankAlisUSD)
  )
  let bank_eurusd_sell = fixNumber(
    fixNumber(pZiraatBankSatisEUR) / fixNumber(pZiraatBankSatisUSD)
  )
  let bank_eurusd_rate = fixNumber(
    fixNumber(
      fixNumber(pZiraatBankSatisEUR) / fixNumber(pZiraatBankSatisUSD)
    ) -
    fixNumber(
      fixNumber(pZiraatBankAlisEUR) / fixNumber(pZiraatBankAlisUSD)
    )
  )

  let create_data = `INSERT INTO realtime_eur_usd (bank_id,eur_usd_buy,eur_usd_sell,eur_usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eurusd_buy}','${bank_eurusd_sell}','${bank_eurusd_rate}')`

  let update_data = `UPDATE realtime_eur_usd SET eur_usd_buy='${bank_eurusd_buy}',eur_usd_sell='${bank_eurusd_sell}',eur_usd_rate='${bank_eurusd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime EUR/USD added!')
  console.log(
    `ZiraatBank - EUR/USD = Alış : ${bank_eurusd_buy} $ / Satış: ${bank_eurusd_sell} $`,
  )
}

async function getZiraatBankAlisGAU(html) {
  const $ = cheerio.load(html)
  const ZiraatBankAlisGAU = $(
    'div#result-altinfiyat > .js-item:not(.hide) > div.table > table > tbody > tr:nth-child(2) > td:nth-child(3)',
  ).text()
  return ZiraatBankAlisGAU
}

async function getZiraatBankSatisGAU(html) {
  const $ = cheerio.load(html)
  const ZiraatBankSatisGAU = $(
    'div#result-altinfiyat > .js-item:not(.hide) > div.table > table > tbody > tr:nth-child(2) > td:nth-child(4)',
  ).text()
  return ZiraatBankSatisGAU
}

export async function getZiraatBankGAU() {
  const html = await getHTML(getURL)
  const pZiraatBankAlisGAU = await getZiraatBankAlisGAU(html)
  const pZiraatBankSatisGAU = await getZiraatBankSatisGAU(html)

  let bank_gau_buy = fixNumber(pZiraatBankAlisGAU)
  let bank_gau_sell = fixNumber(pZiraatBankSatisGAU)
  let bank_gau_rate = fixNumber(
    fixNumber(pZiraatBankSatisGAU) - fixNumber(pZiraatBankAlisGAU)
  )

  let create_data = `INSERT INTO realtime_gau (bank_id,gau_buy,gau_sell,gau_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_gau_buy}','${bank_gau_sell}','${bank_gau_rate}')`

  let update_data = `UPDATE realtime_gau SET gau_buy='${bank_gau_buy}',gau_sell='${bank_gau_sell}',gau_rate='${bank_gau_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime GAU added!')
  console.log(
    `ZiraatBank - GAU = Alış : ${bank_gau_buy} TL / Satış: ${bank_gau_sell} TL`,
  )
}

export default function getZiraatBankForex() {
  return (
    getZiraatBankUSD() +
    getZiraatBankEUR() +
    getZiraatBankGAU() +
    getZiraatBankEURUSD() +
    db(update_sql)
  )
}