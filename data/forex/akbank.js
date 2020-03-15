const axios = require('axios');
const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');
const fixNumber = require('../../functions/numberfix');

const b_name = "Akbank"
const b_slug = "akbank"
const b_url = "https://www.akbank.com"
const b_logo = "https://hangibank.com/assets/img/bank/akbank_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL = "https://www.akbank.com/_vti_bin/AkbankServicesSecure/FrontEndServiceSecure.svc/GetCurrencyRates"

async function getAkBankUSD() {
  try {

    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = JSON.parse(response.data.GetCurrencyRatesResult)
    const resUSDBuy = resData['cur'][33]['DovizAlis']
    const resUSDSell = resData['cur'][33]['DovizSatis']

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
      `AkBank - USD = Alış : ${bank_usd_buy} TL / Satış: ${bank_usd_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: AkBank -> Dolar')
  }

}

async function getAkBankEUR() {
  try {

    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = JSON.parse(response.data.GetCurrencyRatesResult)
    const resEURBuy = resData['cur'][13]['DovizAlis']
    const resEURSell = resData['cur'][13]['DovizSatis']

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
      `AkBank - EUR = Alış : ${bank_eur_buy} TL / Satış: ${bank_eur_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: AkBank -> Euro')
  }
}

async function getAkBankEURUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = JSON.parse(response.data.GetCurrencyRatesResult)
    const resEURBuy = resData['cur'][13]['DovizAlis']
    const resEURSell = resData['cur'][13]['DovizSatis']
    const resUSDBuy = resData['cur'][33]['DovizAlis']
    const resUSDSell = resData['cur'][33]['DovizSatis']

    let bank_eurusd_buy = fixNumber(fixNumber(resEURBuy) / fixNumber(resUSDBuy))
    let bank_eurusd_sell = fixNumber(
      fixNumber(resEURSell) / fixNumber(resUSDSell),
    )
    let bank_eurusd_rate = fixNumber(
      fixNumber(fixNumber(resEURSell) / fixNumber(resUSDSell)) -
      fixNumber(fixNumber(resEURBuy) / fixNumber(resUSDBuy)),
    )

    let create_data = `INSERT INTO realtime_eur_usd (bank_id,eur_usd_buy,eur_usd_sell,eur_usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eurusd_buy}','${bank_eurusd_sell}','${bank_eurusd_rate}')`

    let update_data = `UPDATE realtime_eur_usd SET eur_usd_buy='${bank_eurusd_buy}',eur_usd_sell='${bank_eurusd_sell}',eur_usd_rate='${bank_eurusd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

    db.query(update_data, function (error) {
      if (error) throw error;
    })

    console.log('Realtime EUR/USD added!')
    console.log(
      `AkBank - EUR/USD = Alış : ${bank_eurusd_buy} $ / Satış: ${bank_eurusd_sell} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: AkBank -> Euro/Dolar')
  }
}

async function getAkBankGAU() {

  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = JSON.parse(response.data.GetCurrencyRatesResult)
    const resGAUBuy = resData['cur'][35]['DovizAlis']
    const resGAUSell = resData['cur'][35]['DovizSatis']

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
      `AkBank - GAU = Alış : ${bank_gau_buy} TL / Satış: ${bank_gau_sell} TL`
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: AkBank -> GAU')
  }
}

function getAkbankForex() {
  return (getAkBankUSD() + getAkBankEUR() + getAkBankEURUSD() + getAkBankGAU())
}

module.exports = getAkbankForex;