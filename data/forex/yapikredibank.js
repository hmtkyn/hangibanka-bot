const axios = require('axios');
const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');
const fixNumber = require('../../functions/numberfix');

const b_name = "Yapı Kredi"
const b_slug = "yapikredi"
const b_url = "https://www.yapikredi.com.tr"
const b_logo = "https://hangibank.com/assets/img/bank/yapi_kredi_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL =
  'https://www.yapikredi.com.tr/_ajaxproxy/general.aspx/LoadMainCurrencies'

async function getYapiKrediBankUSD() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'post',
      timeout: 5000,
      headers: {
        'cache-control': 'no-cache',
        Referer:
          'https://www.yapikredi.com.tr/yatirimci-kosesi/doviz-bilgileri',
        Connection: 'keep-alive',
        Cookie:
          '_ga=GA1.3.1277262414.1555785945; _gid=GA1.3.1441522397.1555785945; NSC_xxx.zbqjlsfej.dpn.us_ttm=14b5a3d999658a3d0eafc68099d3f6ebf657efefcc4f80142e0ff9a3655b058681cc0896; ASP.NET_SessionId=xluoaw2edfshbzmlazisk2n5; BehaviorPad_Profile=e8070350-70d8-43b2-8b2a-1c2e0dbb42d9; NSC_xxx.zbqjlsfej.dpn.us_xbg=5508a3d325e0f274457fe5eb7a63a957513b5ce79c6d7be139be7df345e0524263933b75; _gat=1; _fbp=fb.2.1555865718180.136676039; TDESessionID=13873575528454096; _sgf_user_id=72034382979497549; _sgf_session_id=956950636875063296; bp_visit_636914733168263209=p=~/yatirimci-kosesi/doviz-bilgileri&u=636914733423579493&h=2; TS01034ed8=014f1ea3699ff031fe0f3b6baf6481cb6c5fb7781113ceb6d828b8e743e1f55244f655bcc00a8ad73d37d101d3cd5d365acb6f3d647786b5abca37c88767b02f7891c1aa06f83734828d2753e1d551ce57baaf1ced275d0b65f6048fcac9da4079171fa903737cb2f4b6bab1370cf676e82ee5cb0b',
        'X-Requested-With': 'JQuery PageEvents',
        'Cache-Control': 'no-cache',
        Accept: 'text/plain, */*; q=0.01',
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Origin: 'https://www.yapikredi.com.tr',
        Pragma: 'no-cache',
      },
    })

    const resData = fixRes.data.d
    const resUSDBuy = resData[1]['buy']
    const resUSDSell = resData[1]['sell']

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
      `YapiKrediBank - USD = Alış : ${bank_usd_buy} TL / Satış: ${bank_usd_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: Yapı Kredi Bankası -> Dolar')
  }
}

async function getYapiKrediBankEUR() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'post',
      timeout: 5000,
      headers: {
        'cache-control': 'no-cache',
        Referer:
          'https://www.yapikredi.com.tr/yatirimci-kosesi/doviz-bilgileri',
        Connection: 'keep-alive',
        Cookie:
          '_ga=GA1.3.1277262414.1555785945; _gid=GA1.3.1441522397.1555785945; NSC_xxx.zbqjlsfej.dpn.us_ttm=14b5a3d999658a3d0eafc68099d3f6ebf657efefcc4f80142e0ff9a3655b058681cc0896; ASP.NET_SessionId=xluoaw2edfshbzmlazisk2n5; BehaviorPad_Profile=e8070350-70d8-43b2-8b2a-1c2e0dbb42d9; NSC_xxx.zbqjlsfej.dpn.us_xbg=5508a3d325e0f274457fe5eb7a63a957513b5ce79c6d7be139be7df345e0524263933b75; _gat=1; _fbp=fb.2.1555865718180.136676039; TDESessionID=13873575528454096; _sgf_user_id=72034382979497549; _sgf_session_id=956950636875063296; bp_visit_636914733168263209=p=~/yatirimci-kosesi/doviz-bilgileri&u=636914733423579493&h=2; TS01034ed8=014f1ea3699ff031fe0f3b6baf6481cb6c5fb7781113ceb6d828b8e743e1f55244f655bcc00a8ad73d37d101d3cd5d365acb6f3d647786b5abca37c88767b02f7891c1aa06f83734828d2753e1d551ce57baaf1ced275d0b65f6048fcac9da4079171fa903737cb2f4b6bab1370cf676e82ee5cb0b',
        'X-Requested-With': 'JQuery PageEvents',
        'Cache-Control': 'no-cache',
        Accept: 'text/plain, */*; q=0.01',
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Origin: 'https://www.yapikredi.com.tr',
        Pragma: 'no-cache',
      },
    })

    const resData = fixRes.data.d
    const resEURBuy = resData[0]['buy']
    const resEURSell = resData[0]['sell']

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
      `YapiKrediBank - EUR = Alış : ${bank_eur_buy} TL / Satış: ${bank_eur_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: Yapı Kredi Bankası -> Euro')
  }
}

async function getYapiKrediBankEURUSD() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'post',
      timeout: 5000,
      headers: {
        'cache-control': 'no-cache',
        Referer:
          'https://www.yapikredi.com.tr/yatirimci-kosesi/doviz-bilgileri',
        Connection: 'keep-alive',
        Cookie:
          '_ga=GA1.3.1277262414.1555785945; _gid=GA1.3.1441522397.1555785945; NSC_xxx.zbqjlsfej.dpn.us_ttm=14b5a3d999658a3d0eafc68099d3f6ebf657efefcc4f80142e0ff9a3655b058681cc0896; ASP.NET_SessionId=xluoaw2edfshbzmlazisk2n5; BehaviorPad_Profile=e8070350-70d8-43b2-8b2a-1c2e0dbb42d9; NSC_xxx.zbqjlsfej.dpn.us_xbg=5508a3d325e0f274457fe5eb7a63a957513b5ce79c6d7be139be7df345e0524263933b75; _gat=1; _fbp=fb.2.1555865718180.136676039; TDESessionID=13873575528454096; _sgf_user_id=72034382979497549; _sgf_session_id=956950636875063296; bp_visit_636914733168263209=p=~/yatirimci-kosesi/doviz-bilgileri&u=636914733423579493&h=2; TS01034ed8=014f1ea3699ff031fe0f3b6baf6481cb6c5fb7781113ceb6d828b8e743e1f55244f655bcc00a8ad73d37d101d3cd5d365acb6f3d647786b5abca37c88767b02f7891c1aa06f83734828d2753e1d551ce57baaf1ced275d0b65f6048fcac9da4079171fa903737cb2f4b6bab1370cf676e82ee5cb0b',
        'X-Requested-With': 'JQuery PageEvents',
        'Cache-Control': 'no-cache',
        Accept: 'text/plain, */*; q=0.01',
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Origin: 'https://www.yapikredi.com.tr',
        Pragma: 'no-cache',
      },
    })

    const resData = fixRes.data.d
    const resEURBuy = resData[0]['buy']
    const resEURSell = resData[0]['sell']
    const resUSDBuy = resData[1]['buy']
    const resUSDSell = resData[1]['sell']

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
      `YapiKrediBank - EUR/USD = Alış : ${bank_eurusd_buy} $ / Satış: ${bank_eurusd_sell} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: Yapı Kredi Bankası -> Euro/Dolar',
    )
  }
}

async function getYapiKrediBankGAU() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'post',
      timeout: 5000,
      headers: {
        'cache-control': 'no-cache',
        Referer:
          'https://www.yapikredi.com.tr/yatirimci-kosesi/doviz-bilgileri',
        Connection: 'keep-alive',
        Cookie:
          '_ga=GA1.3.1277262414.1555785945; _gid=GA1.3.1441522397.1555785945; NSC_xxx.zbqjlsfej.dpn.us_ttm=14b5a3d999658a3d0eafc68099d3f6ebf657efefcc4f80142e0ff9a3655b058681cc0896; ASP.NET_SessionId=xluoaw2edfshbzmlazisk2n5; BehaviorPad_Profile=e8070350-70d8-43b2-8b2a-1c2e0dbb42d9; NSC_xxx.zbqjlsfej.dpn.us_xbg=5508a3d325e0f274457fe5eb7a63a957513b5ce79c6d7be139be7df345e0524263933b75; _gat=1; _fbp=fb.2.1555865718180.136676039; TDESessionID=13873575528454096; _sgf_user_id=72034382979497549; _sgf_session_id=956950636875063296; bp_visit_636914733168263209=p=~/yatirimci-kosesi/doviz-bilgileri&u=636914733423579493&h=2; TS01034ed8=014f1ea3699ff031fe0f3b6baf6481cb6c5fb7781113ceb6d828b8e743e1f55244f655bcc00a8ad73d37d101d3cd5d365acb6f3d647786b5abca37c88767b02f7891c1aa06f83734828d2753e1d551ce57baaf1ced275d0b65f6048fcac9da4079171fa903737cb2f4b6bab1370cf676e82ee5cb0b',
        'X-Requested-With': 'JQuery PageEvents',
        'Cache-Control': 'no-cache',
        Accept: 'text/plain, */*; q=0.01',
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Origin: 'https://www.yapikredi.com.tr',
        Pragma: 'no-cache',
      },
    })

    const resData = fixRes.data.d
    const resGAUBuy = resData[2]['buy']
    const resGAUSell = resData[2]['sell']

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
      `YapiKrediBank - GAU = Alış : ${bank_gau_buy} TL / Satış: ${bank_gau_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: Yapı Kredi Bankası -> Altın')
  }
}

function getYapiKrediBankForex() {
  return (
    getYapiKrediBankUSD() +
    getYapiKrediBankEUR() +
    getYapiKrediBankGAU() +
    getYapiKrediBankEURUSD()
  )
}

module.exports = getYapiKrediBankForex;