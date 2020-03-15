const axios = require('axios');
const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');
const fixNumber = require('../../functions/numberfix');

const b_name = "ING Bank"
const b_slug = "ing"
const b_url = "https://www.ing.com.tr"
const b_logo = "https://hangibank.com/assets/img/bank/ing_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL =
  'https://www.ing.com.tr/ProxyManagement/SiteManagerService_Script.aspx/GetCurrencyRates'

function checkTime(i) {
  if (i < 10) {
    i = '0' + i
  }
  return i
}

var fxgun = checkTime(new Date().getDate())
var fxaycore = new Date().getMonth()
var fxay = checkTime(++fxaycore)
var fxyil = new Date().getFullYear()
var fxsaat = checkTime(new Date().getHours())
var fxdk = checkTime(new Date().getMinutes())
var fixDate =
  fxyil + '-' + fxay + '-' + fxgun + 'T' + fxsaat + ':' + fxdk + ':00.000Z'

async function getIngBankUSD() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'post',
      timeout: 9000,
      data: { date: fixDate },
      headers: {
        'cache-control': 'no-cache',
        Connection: 'keep-alive',
        Referer: 'https://www.ing.com.tr/tr/bilgi-destek/yatirim/doviz-kurlari',
        'Cache-Control': 'no-cache',
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language': 'tr',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Origin: 'https://www.ing.com.tr',
        Pragma: 'no-cache',
      },
    })
    const resData = fixRes.data.d
    const resUSDBuy = resData[0]['BuyingExchangeRate']
    const resUSDSell = resData[0]['SellingExchangeRate']

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
      `IngBank - USD = Alış : ${bank_usd_buy} TL / Satış: ${bank_usd_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: INGBank -> Dolar')
  }
}

async function getIngBankEUR() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'post',
      timeout: 9000,
      data: { date: fixDate },
      headers: {
        'cache-control': 'no-cache',
        Connection: 'keep-alive',
        Referer: 'https://www.ing.com.tr/tr/bilgi-destek/yatirim/doviz-kurlari',
        'Cache-Control': 'no-cache',
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language': 'tr',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Origin: 'https://www.ing.com.tr',
        Pragma: 'no-cache',
      },
    })

    const resData = fixRes.data.d
    const resEURBuy = resData[1]['BuyingExchangeRate']
    const resEURSell = resData[1]['SellingExchangeRate']

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
      `IngBank - EUR = Alış : ${bank_eur_buy} TL / Satış: ${bank_eur_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: INGBank -> Euro')
  }
}

async function getIngBankEURUSD() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'post',
      timeout: 9000,
      data: { date: fixDate },
      headers: {
        'cache-control': 'no-cache',
        Connection: 'keep-alive',
        Referer: 'https://www.ing.com.tr/tr/bilgi-destek/yatirim/doviz-kurlari',
        'Cache-Control': 'no-cache',
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language': 'tr',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Origin: 'https://www.ing.com.tr',
        Pragma: 'no-cache',
      },
    })

    const resData = fixRes.data.d
    const resEURBuy = resData[1]['BuyingExchangeRate']
    const resEURSell = resData[1]['SellingExchangeRate']
    const resUSDBuy = resData[0]['BuyingExchangeRate']
    const resUSDSell = resData[0]['SellingExchangeRate']

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
      `IngBank - EUR/USD = Alış : ${bank_eurusd_buy} $ / Satış: ${bank_eurusd_sell} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: INGBank -> Euro/Dolar')
  }
}

async function getIngBankGAU() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'post',
      timeout: 9000,
      data: { date: fixDate },
      headers: {
        'cache-control': 'no-cache',
        Connection: 'keep-alive',
        Referer: 'https://www.ing.com.tr/tr/bilgi-destek/yatirim/doviz-kurlari',
        'Cache-Control': 'no-cache',
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language': 'tr',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Origin: 'https://www.ing.com.tr',
        Pragma: 'no-cache',
      },
    })

    const resData = fixRes.data.d
    const resGAUBuy = resData[13]['BuyingExchangeRate']
    const resGAUSell = resData[13]['SellingExchangeRate']

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
      `IngBank - GAU = Alış : ${bank_gau_buy} TL / Satış: ${bank_gau_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: INGBank -> Altın')
  }
}

function getIngBankForex() {
  return (
    getIngBankUSD() + getIngBankEUR() + getIngBankGAU() + getIngBankEURUSD()
  )
}

module.exports = getIngBankForex;