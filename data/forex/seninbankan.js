const axios = require('axios');
const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');
const fixNumber = require('../../functions/numberfix');

const b_name = "SeninBankan"
const b_slug = "seninbankan"
const b_url = "https://www.seninbankan.com.tr"
const b_logo = "https://hangibank.com/assets/img/bank/seninbankan_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Katılım"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`


const getURL = 'https://www.seninbankan.com.tr/Services/ForexService.aspx'
const fixDate = Date.now()

async function getSeninBankanUSD() {
  try {
    const response = await axios({
      method: 'get',
      url: getURL,
      timeout: 5000,
      params: {
        _: fixDate,
      },
      headers: {
        'cache-control': 'no-cache',
        Referer: 'https://www.seninbankan.com.tr/piyasa-verileri.aspx',
        Connection: 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3,pt;q=0.2,de;q=0.1',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Pragma: 'no-cache',
      },
    })
    const resUSDBuy = response.data[0]['Value'].CurrencyBid
    const resUSDSell = response.data[0]['Value'].CurrencyAsk

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
      `SeninBankan - USD = Alış : ${bank_usd_buy} TL / Satış: ${bank_usd_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: SeninBankan -> Dolar')
  }
}

async function getSeninBankanEUR() {
  try {
    const response = await axios({
      method: 'get',
      url: getURL,
      timeout: 5000,
      params: {
        _: fixDate,
      },
      headers: {
        'cache-control': 'no-cache',
        Referer: 'https://www.seninbankan.com.tr/piyasa-verileri.aspx',
        Connection: 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3,pt;q=0.2,de;q=0.1',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Pragma: 'no-cache',
      },
    })
    const resEURBuy = response.data[18]['Value'].CurrencyBid
    const resEURSell = response.data[18]['Value'].CurrencyAsk

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
      `SeninBankan - EUR = Alış : ${bank_eur_buy} TL / Satış: ${bank_eur_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: SeninBankan -> Euro')
  }
}

async function getSeninBankanEURUSD() {
  try {
    const response = await axios({
      method: 'get',
      url: getURL,
      timeout: 5000,
      params: {
        _: fixDate,
      },
      headers: {
        'cache-control': 'no-cache',
        Referer: 'https://www.seninbankan.com.tr/piyasa-verileri.aspx',
        Connection: 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3,pt;q=0.2,de;q=0.1',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Pragma: 'no-cache',
      },
    })
    const resEURBuy = response.data[18]['Value'].CurrencyBid
    const resEURSell = response.data[18]['Value'].CurrencyAsk
    const resUSDBuy = response.data[0]['Value'].CurrencyBid
    const resUSDSell = response.data[0]['Value'].CurrencyAsk

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
      `SeninBankan - EUR/USD = Alış : ${bank_eurusd_buy} $ / Satış: ${bank_eurusd_sell} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: SeninBankan -> Euro/Dolar')
  }
}

async function getSeninBankanGAU() {
  try {
    const response = await axios({
      method: 'get',
      url: getURL,
      timeout: 5000,
      params: {
        _: fixDate,
      },
      headers: {
        'cache-control': 'no-cache',
        Referer: 'https://www.seninbankan.com.tr/piyasa-verileri.aspx',
        Connection: 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3,pt;q=0.2,de;q=0.1',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Pragma: 'no-cache',
      },
    })
    const resGAUBuy = response.data[30]['Value'].CurrencyBid
    const resGAUSell = response.data[30]['Value'].CurrencyAsk

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
      `SeninBankan - GAU = Alış : ${bank_gau_buy} TL / Satış: ${bank_gau_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: SeninBankan -> Altın')
  }
}

function getSeninBankanForex() {
  return (
    getSeninBankanUSD() +
    getSeninBankanEUR() +
    getSeninBankanGAU() +
    getSeninBankanEURUSD()
  )
}

module.exports = getSeninBankanForex;