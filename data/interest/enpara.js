import axios from 'axios'
import cheerio from 'cheerio'
import TegAction from '../../functions/telegram'
import db from '../../functions/mysql'
import fixNumber from '../../functions/numberfix'

const b_name = "EnPara"
const b_slug = "enpara"
const b_url = "https://www.qnbfinansbank.enpara.com"
const b_logo = "https://hangibank.com/assets/img/bank/enpara_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

const getURL =
  'https://www.qnbfinansbank.enpara.com/hesaplar/doviz-ve-altin-kurlari'

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
    TegAction('Hey Profesör! Problem: EnPara')
  }
}

async function getEnParaAlisUSD(html) {
  const $ = cheerio.load(html)
  const EnParaAlisUSD = $(
    'div.enpara-gold-exchange-rates__table > div.enpara-gold-exchange-rates__table-item:nth-child(2) > span:nth-child(2)',
  ).text()
  return EnParaAlisUSD
}

async function getEnParaSatisUSD(html) {
  const $ = cheerio.load(html)
  const EnParaSatisUSD = $(
    'div.enpara-gold-exchange-rates__table > div.enpara-gold-exchange-rates__table-item:nth-child(2) > span:nth-child(3)',
  ).text()
  return EnParaSatisUSD
}

export async function getEnParaUSD() {
  const html = await getHTML(getURL)
  const pEnParaAlisUSD = await getEnParaAlisUSD(html)
  const pEnParaSatisUSD = await getEnParaSatisUSD(html)

  let bank_usd_buy = fixNumber(pEnParaAlisUSD)
  let bank_usd_sell = fixNumber(pEnParaSatisUSD)
  let bank_usd_rate = fixNumber(
    fixNumber(pEnParaSatisUSD) - fixNumber(pEnParaAlisUSD)
  )

  let create_data = `INSERT INTO realtime_usd (bank_id,usd_buy,usd_sell,usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_usd_buy}','${bank_usd_sell}','${bank_usd_rate}')`

  let update_data = `UPDATE realtime_usd SET usd_buy='${bank_usd_buy}',usd_sell='${bank_usd_sell}',usd_rate='${bank_usd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime USD added!')
  console.log(
    `EnPara - USD = Alış : ${bank_usd_buy} / Satış: ${bank_usd_sell}`,
  )
}

async function getEnParaAlisEUR(html) {
  const $ = cheerio.load(html)
  const EnParaAlisEUR = $(
    'div.enpara-gold-exchange-rates__table > div.enpara-gold-exchange-rates__table-item:nth-child(3) > span:nth-child(2)',
  ).text()
  return EnParaAlisEUR
}

async function getEnParaSatisEUR(html) {
  const $ = cheerio.load(html)
  const EnParaSatisEUR = $(
    'div.enpara-gold-exchange-rates__table > div.enpara-gold-exchange-rates__table-item:nth-child(3) > span:nth-child(3)',
  ).text()
  return EnParaSatisEUR
}

export async function getEnParaEUR() {
  const html = await getHTML(getURL)
  const pEnParaAlisEUR = await getEnParaAlisEUR(html)
  const pEnParaSatisEUR = await getEnParaSatisEUR(html)

  let bank_eur_buy = fixNumber(pEnParaAlisEUR)
  let bank_eur_sell = fixNumber(pEnParaSatisEUR)
  let bank_eur_rate = fixNumber(
    fixNumber(pEnParaSatisEUR) - fixNumber(pEnParaAlisEUR)
  )

  let create_data = `INSERT INTO realtime_eur (bank_id,eur_buy,eur_sell,eur_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eur_buy}','${bank_eur_sell}','${bank_eur_rate}')`

  let update_data = `UPDATE realtime_eur SET eur_buy='${bank_eur_buy}',eur_sell='${bank_eur_sell}',eur_rate='${bank_eur_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime EUR added!')
  console.log(
    `EnPara - EUR = Alış : ${bank_eur_buy} / Satış: ${bank_eur_sell}`,
  )
}

export async function getEnParaEURUSD() {
  const html = await getHTML(getURL)
  const pEnParaAlisEUR = await getEnParaAlisEUR(html)
  const pEnParaSatisEUR = await getEnParaSatisEUR(html)
  const pEnParaAlisUSD = await getEnParaAlisUSD(html)
  const pEnParaSatisUSD = await getEnParaSatisUSD(html)

  let bank_eurusd_buy = fixNumber(
    fixNumber(pEnParaAlisEUR) / fixNumber(pEnParaAlisUSD),
  )
  let bank_eurusd_sell = fixNumber(
    fixNumber(pEnParaSatisEUR) / fixNumber(pEnParaSatisUSD),
  )
  let bank_eurusd_rate = fixNumber(
    fixNumber(fixNumber(pEnParaSatisEUR) / fixNumber(pEnParaSatisUSD)) -
    fixNumber(fixNumber(pEnParaAlisEUR) / fixNumber(pEnParaAlisUSD))
  )

  let create_data = `INSERT INTO realtime_eur_usd (bank_id,eur_usd_buy,eur_usd_sell,eur_usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eurusd_buy}','${bank_eurusd_sell}','${bank_eurusd_rate}')`

  let update_data = `UPDATE realtime_eur_usd SET eur_usd_buy='${bank_eurusd_buy}',eur_usd_sell='${bank_eurusd_sell}',eur_usd_rate='${bank_eurusd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime EUR/USD added!')
  console.log(
    `EnPara - EUR/USD = Alış : ${bank_eurusd_buy} / Satış: ${bank_eurusd_sell}`,
  )
}

async function getEnParaAlisGAU(html) {
  const $ = cheerio.load(html)
  const EnParaAlisGAU = $(
    'div.enpara-gold-exchange-rates__table > div.enpara-gold-exchange-rates__table-item:nth-child(4) > span:nth-child(2)',
  ).text()
  return EnParaAlisGAU
}

async function getEnParaSatisGAU(html) {
  const $ = cheerio.load(html)
  const EnParaSatisGAU = $(
    'div.enpara-gold-exchange-rates__table > div.enpara-gold-exchange-rates__table-item:nth-child(4) > span:nth-child(3)',
  ).text()
  return EnParaSatisGAU
}

export async function getEnParaGAU() {
  const html = await getHTML(getURL)
  const pEnParaAlisGAU = await getEnParaAlisGAU(html)
  const pEnParaSatisGAU = await getEnParaSatisGAU(html)

  let bank_gau_buy = fixNumber(pEnParaAlisGAU)
  let bank_gau_sell = fixNumber(pEnParaSatisGAU)
  let bank_gau_rate = fixNumber(
    fixNumber(pEnParaSatisGAU) - fixNumber(pEnParaAlisGAU)
  )

  let create_data = `INSERT INTO realtime_gau (bank_id,gau_buy,gau_sell,gau_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_gau_buy}','${bank_gau_sell}','${bank_gau_rate}')`

  let update_data = `UPDATE realtime_gau SET gau_buy='${bank_gau_buy}',gau_sell='${bank_gau_sell}',gau_rate='${bank_gau_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

  db(update_data)

  console.log('Realtime GAU added!')
  console.log(
    `EnPara - GAU = Alış : ${bank_gau_buy} / Satış: ${bank_gau_sell}`,
  )
}

export default function getEnParaForex() {
  return (getEnParaUSD() + getEnParaEUR() + getEnParaGAU() + getEnParaEURUSD() + db(update_sql))
}