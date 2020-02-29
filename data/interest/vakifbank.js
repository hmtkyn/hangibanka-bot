import axios from 'axios'
import cheerio from 'cheerio'
import TegAction from '../../functions/telegram'
import db from '../../functions/mysql'
import fixNumber from '../../functions/numberfix'

const b_name = "VakıfBank"
const b_slug = "vakifbank"
const b_url = "https://www.vakifbank.com.tr"
const b_logo = "https://hangibank.com/assets/img/bank/vakif_logo.jpg"
const b_type_capital = "Kamu"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL =
  'https://subesizbankacilik.vakifbank.com.tr/gunlukfinans/SubesizBankacilik/GunlukDovizKurlari.aspx'

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
    TegAction('Hey Profesör! Problem: VakıfBank')
  }
}

async function getVakifBankAlisUSD(html) {
  const $ = cheerio.load(html)
  const VakifBankAlisUSD = $(
    '#ctl00_plchldContent_dtaGridDovizKurlari > tbody > tr:nth-child(2) > td:nth-child(2)',
  ).text()
  return VakifBankAlisUSD
}

async function getVakifBankSatisUSD(html) {
  const $ = cheerio.load(html)
  const VakifBankSatisUSD = $(
    'table#ctl00_plchldContent_dtaGridDovizKurlari > tbody > tr:nth-child(2) > td:nth-child(3)',
  ).text()
  return VakifBankSatisUSD
}

export async function getVakifBankUSD() {
  const html = await getHTML(getURL)
  const pVakifBankAlisUSD = await getVakifBankAlisUSD(html)
  const pVakifBankSatisUSD = await getVakifBankSatisUSD(html)

  let bank_usd_buy = fixNumber(pVakifBankAlisUSD)
  let bank_usd_sell = fixNumber(pVakifBankSatisUSD)
  let bank_usd_rate = fixNumber(
    fixNumber(pVakifBankSatisUSD) - fixNumber(pVakifBankAlisUSD)
  )

  let create_data = `INSERT INTO realtime_usd (bank_id,usd_buy,usd_sell,usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_usd_buy}','${bank_usd_sell}','${bank_usd_rate}')`

  let update_data = `UPDATE realtime_usd SET usd_buy='${bank_usd_buy}',usd_sell='${bank_usd_sell}',usd_rate='${bank_usd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime USD added!')
  console.log(
    `VakifBank - USD = Alış : ${bank_usd_buy} TL / Satış: ${bank_usd_sell} TL`,
  )
}

async function getVakifBankAlisEUR(html) {
  const $ = cheerio.load(html)
  const VakifBankAlisEUR = $(
    '#ctl00_plchldContent_dtaGridDovizKurlari > tbody > tr:nth-child(3) > td:nth-child(2)',
  ).text()
  return VakifBankAlisEUR
}

async function getVakifBankSatisEUR(html) {
  const $ = cheerio.load(html)
  const VakifBankSatisEUR = $(
    'table#ctl00_plchldContent_dtaGridDovizKurlari > tbody > tr:nth-child(3) > td:nth-child(3)',
  ).text()
  return VakifBankSatisEUR
}

export async function getVakifBankEUR() {
  const html = await getHTML(getURL)
  const pVakifBankAlisEUR = await getVakifBankAlisEUR(html)
  const pVakifBankSatisEUR = await getVakifBankSatisEUR(html)


  let bank_eur_buy = fixNumber(pVakifBankAlisEUR)
  let bank_eur_sell = fixNumber(pVakifBankSatisEUR)
  let bank_eur_rate = fixNumber(
    fixNumber(pVakifBankSatisEUR) - fixNumber(pVakifBankAlisEUR)
  )

  let create_data = `INSERT INTO realtime_eur (bank_id,eur_buy,eur_sell,eur_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eur_buy}','${bank_eur_sell}','${bank_eur_rate}')`

  let update_data = `UPDATE realtime_eur SET eur_buy='${bank_eur_buy}',eur_sell='${bank_eur_sell}',eur_rate='${bank_eur_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime EUR added!')
  console.log(
    `VakifBank - EUR = Alış : ${bank_eur_buy} TL / Satış: ${bank_eur_sell} TL`,
  )
}

export async function getVakifBankEURUSD() {
  const html = await getHTML(getURL)
  const pVakifBankAlisEUR = await getVakifBankAlisEUR(html)
  const pVakifBankSatisEUR = await getVakifBankSatisEUR(html)
  const pVakifBankAlisUSD = await getVakifBankAlisUSD(html)
  const pVakifBankSatisUSD = await getVakifBankSatisUSD(html)

  let bank_eurusd_buy = fixNumber(
    fixNumber(pVakifBankAlisEUR) / fixNumber(pVakifBankAlisUSD)
  )
  let bank_eurusd_sell = fixNumber(
    fixNumber(pVakifBankSatisEUR) / fixNumber(pVakifBankSatisUSD)
  )
  let bank_eurusd_rate = fixNumber(
    fixNumber(fixNumber(pVakifBankSatisEUR) / fixNumber(pVakifBankSatisUSD)) -
    fixNumber(fixNumber(pVakifBankAlisEUR) / fixNumber(pVakifBankAlisUSD))
  )

  let create_data = `INSERT INTO realtime_eur_usd (bank_id,eur_usd_buy,eur_usd_sell,eur_usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eurusd_buy}','${bank_eurusd_sell}','${bank_eurusd_rate}')`

  let update_data = `UPDATE realtime_eur_usd SET eur_usd_buy='${bank_eurusd_buy}',eur_usd_sell='${bank_eurusd_sell}',eur_usd_rate='${bank_eurusd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime EUR/USD added!')
  console.log(
    `VakifBank - EUR/USD = Alış : ${bank_eurusd_buy} $ / Satış: ${bank_eurusd_sell} $`,
  )
}

const getGAUURL =
  'https://subesizbankacilik.vakifbank.com.tr/gunlukfinans/SubesizBankacilik/AltinFiyatlari.aspx'

async function getGAUHTML(url) {
  try {
    const { data: html } = await axios({
      method: 'get',
      url: getGAUURL,
      timeout: 5000,
    })
    return html
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: VakıfBank - Altın')
  }
}

async function getVakifBankAlisGAU(html) {
  const $ = cheerio.load(html)
  const VakifBankAlisGAU = $(
    'table#ctl00_plchldContent_dtaGridAltin > tbody > tr:nth-child(3) > td:nth-child(3)',
  ).text()
  return VakifBankAlisGAU
}

async function getVakifBankSatisGAU(html) {
  const $ = cheerio.load(html)
  const VakifBankSatisGAU = $(
    'table#ctl00_plchldContent_dtaGridAltin > tbody > tr:nth-child(3) > td:nth-child(4)',
  ).text()
  return VakifBankSatisGAU
}

export async function getVakifBankGAU() {
  const html = await getGAUHTML(getURL)
  const pVakifBankAlisGAU = await getVakifBankAlisGAU(html)
  const pVakifBankSatisGAU = await getVakifBankSatisGAU(html)

  let bank_gau_buy = fixNumber(pVakifBankAlisGAU)
  let bank_gau_sell = fixNumber(pVakifBankSatisGAU)
  let bank_gau_rate = fixNumber(
    fixNumber(pVakifBankSatisGAU) - fixNumber(pVakifBankAlisGAU)
  )

  let create_data = `INSERT INTO realtime_gau (bank_id,gau_buy,gau_sell,gau_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_gau_buy}','${bank_gau_sell}','${bank_gau_rate}')`

  let update_data = `UPDATE realtime_gau SET gau_buy='${bank_gau_buy}',gau_sell='${bank_gau_sell}',gau_rate='${bank_gau_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime GAU added!')
  console.log(
    `VakifBank - GAU = Alış : ${bank_gau_buy} TL / Satış: ${bank_gau_sell} TL`,
  )
}

export default function getVakifBankForex() {
  return (
    getVakifBankUSD() +
    getVakifBankEUR() +
    getVakifBankGAU() +
    getVakifBankEURUSD() +
    db(update_sql)
  )
}