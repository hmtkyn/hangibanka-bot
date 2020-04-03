const axios = require('axios');
const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');
const fixNumber = require('../../functions/numberfix');

const b_name = "İş Bank"
const b_slug = "isbank"
const b_url = "https://www.isbank.com.tr"
const b_logo = "https://hangibank.com/assets/img/bank/is_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

let fixUTCMonth = new Date().getUTCMonth()

let fixUTCFullTime = new Date().getUTCFullYear() + '-' + ++fixUTCMonth + '-' + new Date().getUTCDate()

let fixUTCFullTimeConvert = parseInt((new Date().getTime()))

console.log(fixUTCFullTime);
console.log(fixUTCFullTimeConvert);

let getURL = "https://www.isbank.com.tr/_vti_bin/DV.Isbank/PriceAndRate/PriceAndRateService.svc/GetFxRates?Lang=tr&fxRateType=INTERACTIVE&date=" + fixUTCFullTime + "&time=" + fixUTCFullTimeConvert + ""

// let ss = "https://www.isbank.com.tr/_vti_bin/DV.Isbank/PriceAndRate/PriceAndRateService.svc/GetFxRates?Lang=tr&fxRateType=INTERACTIVE&date=2020-04-03&time=1585904599201"

async function getIsBankUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data.Data
    const resUSDBuy = resData[0]['fxRateBuy']
    const resUSDSell = resData[0]['fxRateSell']

    let bank_usd_buy = fixNumber(resUSDBuy)
    let bank_usd_sell = fixNumber(resUSDSell)
    let bank_usd_rate = fixNumber(fixNumber(resUSDSell) - fixNumber(resUSDBuy))

    let create_data = `INSERT INTO realtime_usd (bank_id,usd_buy,usd_sell,usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_usd_buy}','${bank_usd_sell}','${bank_usd_rate}')`

    let update_data = `UPDATE realtime_usd SET usd_buy='${bank_usd_buy}',usd_sell='${bank_usd_sell}',usd_rate='${bank_usd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

    db.query(update_data, function (error) {
      if (error) throw error;
    })

    console.log('Realtime USD added!')
    console.log(
      `IsBank - USD = Alış : ${bank_usd_buy} TL / Satış: ${bank_usd_sell} TL / Rate: ${bank_usd_rate} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: IsBank -> Dolar')
  }
}

async function getIsBankEUR() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data.Data
    const resEURBuy = resData[1]['fxRateBuy']
    const resEURSell = resData[1]['fxRateSell']

    let bank_eur_buy = fixNumber(resEURBuy)
    let bank_eur_sell = fixNumber(resEURSell)
    let bank_eur_rate = fixNumber(fixNumber(resEURSell) - fixNumber(resEURBuy))

    let create_data = `INSERT INTO realtime_eur (bank_id,eur_buy,eur_sell,eur_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eur_buy}','${bank_eur_sell}','${bank_eur_rate}')`

    let update_data = `UPDATE realtime_eur SET eur_buy='${bank_eur_buy}',eur_sell='${bank_eur_sell}',eur_rate='${bank_eur_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

    db.query(update_data, function (error) {
      if (error) throw error;
    })

    console.log('Realtime EUR added!')
    console.log(
      `IsBank - EUR = Alış : ${bank_eur_buy} TL / Satış: ${bank_eur_sell} TL / Rate: ${bank_eur_rate} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: IsBank -> Euro')
  }
}

async function getIsBankEURUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data.Data
    const resEURBuy = resData[1]['fxRateBuy']
    const resEURSell = resData[1]['fxRateSell']
    const resUSDBuy = resData[0]['fxRateBuy']
    const resUSDSell = resData[0]['fxRateSell']

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

    db.query(update_data, function (error) {
      if (error) throw error;
    })

    console.log('Realtime EUR/USD added!')
    console.log(
      `IsBank - EUR/USD = Alış : ${bank_eurusd_buy} $ / Satış: ${bank_eurusd_sell} $ / Rate: ${bank_eurusd_rate} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: IsBank -> Euro/Dolar')
  }
}

async function getIsBankGAU() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data.Data
    const resGAUBuy = resData[3]['fxRateBuy']
    const resGAUSell = resData[3]['fxRateSell']

    let bank_gau_buy = fixNumber(resGAUBuy)
    let bank_gau_sell = fixNumber(resGAUSell)
    let bank_gau_rate = fixNumber(fixNumber(resGAUSell) - fixNumber(resGAUBuy))

    let create_data = `INSERT INTO realtime_gau (bank_id,gau_buy,gau_sell,gau_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_gau_buy}','${bank_gau_sell}','${bank_gau_rate}')`

    let update_data = `UPDATE realtime_gau SET gau_buy='${bank_gau_buy}',gau_sell='${bank_gau_sell}',gau_rate='${bank_gau_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

    db.query(update_data, function (error) {
      if (error) throw error;
    })

    console.log('Realtime GAU added!')
    console.log(
      `IsBank - GAU = Alış : ${bank_gau_buy} TL / Satış: ${bank_gau_sell} TL / Rate: ${bank_gau_rate} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: IsBank -> Altın')
  }
}

function getIsBankForex() {
  return (
    getIsBankUSD() +
    getIsBankEUR() +
    getIsBankEURUSD() +
    getIsBankGAU()
  )
}
module.exports = getIsBankForex;