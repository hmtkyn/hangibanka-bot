import axios from 'axios'
import TegAction from '../../functions/telegram'
import db from '../../functions/mysql'
import fixNumber from '../../functions/numberfix'

const b_name = "QNB Finansbank"
const b_slug = "qnbfinansbank"
const b_url = "https://www.qnbfinansbank.com"
const b_logo = "https://hangibank.com/assets/img/bank/qnb_finans_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

let fixUTCMonth = new Date().getUTCMonth()

let fixUTCFullTime =
  new Date().getUTCFullYear() +
  '-' +
  ++fixUTCMonth +
  '-' +
  new Date().getUTCDate()

const getURL =
  'https://www.qnbfinansbank.com/api/LoanCalculators/ExchangeParite?exChangeDate=' +
  fixUTCFullTime +
  '&channelCode=148'

export async function getQNBFinansBankUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resUSDBuy = resData[0]['effectiveBuyingExchangeRateField']
    const resUSDSell = resData[0]['effectiveSellingExchangeRateField']

    let bank_usd_buy = fixNumber(resUSDBuy)
    let bank_usd_sell = fixNumber(resUSDSell)
    let bank_usd_rate = fixNumber(fixNumber(resUSDSell) - fixNumber(resUSDBuy))

    let create_data = `INSERT INTO realtime_usd (bank_id,usd_buy,usd_sell,usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_usd_buy}','${bank_usd_sell}','${bank_usd_rate}')`

    let update_data = `UPDATE realtime_usd SET usd_buy='${bank_usd_buy}',usd_sell='${bank_usd_sell}',usd_rate='${bank_usd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

    db(update_data)

    console.log('Realtime USD added!')
    console.log(
      `QNBFinansBank - USD = Alış : ${bank_usd_buy} TL / Satış: ${bank_usd_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: QNB FinansBank -> Dolar')
  }
}

export async function getQNBFinansBankEUR() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resEURBuy = resData[1]['effectiveBuyingExchangeRateField']
    const resEURSell = resData[1]['effectiveSellingExchangeRateField']

    let bank_eur_buy = fixNumber(resEURBuy)
    let bank_eur_sell = fixNumber(resEURSell)
    let bank_eur_rate = fixNumber(fixNumber(resEURSell) - fixNumber(resEURBuy))

    let create_data = `INSERT INTO realtime_eur (bank_id,eur_buy,eur_sell,eur_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eur_buy}','${bank_eur_sell}','${bank_eur_rate}')`

    let update_data = `UPDATE realtime_eur SET eur_buy='${bank_eur_buy}',eur_sell='${bank_eur_sell}',eur_rate='${bank_eur_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

    db(update_data)

    console.log('Realtime EUR added!')
    console.log(
      `QNBFinansBank - EUR = Alış : ${bank_eur_buy} TL / Satış: ${bank_eur_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: QNB FinansBank -> Euro')
  }
}

export async function getQNBFinansBankEURUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resEURBuy = resData[1]['effectiveBuyingExchangeRateField']
    const resEURSell = resData[1]['effectiveSellingExchangeRateField']
    const resUSDBuy = resData[0]['effectiveBuyingExchangeRateField']
    const resUSDSell = resData[0]['effectiveSellingExchangeRateField']

    let bank_eurusd_buy = fixNumber(fixNumber(resEURBuy) / fixNumber(resUSDBuy))
    let bank_eurusd_sell = fixNumber(
      fixNumber(resEURSell) / fixNumber(resUSDSell)
    )
    let bank_eurusd_rate = fixNumber(
      fixNumber(fixNumber(resEURSell) / fixNumber(resUSDSell)) -
      fixNumber(fixNumber(resEURBuy) / fixNumber(resUSDBuy))
    )

    let create_data = `INSERT INTO realtime_eur_usd (bank_id,eur_usd_buy,eur_usd_sell,eur_usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eurusd_buy}','${bank_eurusd_sell}','${bank_eurusd_rate}')`

    let update_data = `UPDATE realtime_eur_usd SET eur_usd_buy='${bank_eurusd_buy}',eur_usd_sell='${bank_eurusd_sell}',eur_usd_rate='${bank_eurusd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

    db(update_data)

    console.log('Realtime EUR/USD added!')
    console.log(
      `QNBFinansBank - EUR/USD = Alış : ${bank_eurusd_buy} $ / Satış: ${bank_eurusd_sell} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: QNB FinansBank -> Euro/Dolar')
  }
}

export async function getQNBFinansBankGAU() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resGAUBuy = resData[16]['effectiveBuyingExchangeRateField']
    const resGAUSell = resData[16]['effectiveSellingExchangeRateField']

    let bank_gau_buy = fixNumber(resGAUBuy)
    let bank_gau_sell = fixNumber(resGAUSell)
    let bank_gau_rate = fixNumber(fixNumber(resGAUSell) - fixNumber(resGAUBuy))

    let create_data = `INSERT INTO realtime_gau (bank_id,gau_buy,gau_sell,gau_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_gau_buy}','${bank_gau_sell}','${bank_gau_rate}')`

    let update_data = `UPDATE realtime_gau SET gau_buy='${bank_gau_buy}',gau_sell='${bank_gau_sell}',gau_rate='${bank_gau_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

    db(update_data)

    console.log('Realtime GAU added!')
    console.log(
      `QNBFinansBank - GAU = Alış : ${bank_gau_buy} TL / Satış: ${bank_gau_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: QNB FinansBank -> Altın')
  }
}

export default function getQNBFinansBankForex() {
  return (
    getQNBFinansBankUSD() +
    getQNBFinansBankEUR() +
    getQNBFinansBankGAU() +
    getQNBFinansBankEURUSD() +
    db(update_sql)
  )
}