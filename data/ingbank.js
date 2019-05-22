import axios from 'axios'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_ingbank')
const setBankData = getDoc.update({
  bank_name: 'ING Bank',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fing_logo.png?alt=media&token=1a5cefa7-8ed2-4955-8f5e-41525d923888',
})

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
export async function getIngBankUSD() {
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

    const setUSD = getDoc.update({
      bank_usd_buy: fixNumber(resUSDBuy),
      bank_usd_sell: fixNumber(resUSDSell),
      bank_usd_rate: fixNumber(fixNumber(resUSDSell) - fixNumber(resUSDBuy)),
      bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `IngBank - USD = Alış : ${resUSDBuy} TL / Satış: ${resUSDSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: INGBank -> Dolar')
  }
}

export async function getIngBankEUR() {
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

    const setEUR = getDoc.update({
      bank_eur_buy: fixNumber(resEURBuy),
      bank_eur_sell: fixNumber(resEURSell),
      bank_eur_rate: fixNumber(fixNumber(resEURSell) - fixNumber(resEURBuy)),
      bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `IngBank - EUR = Alış : ${resEURBuy} TL / Satış: ${resEURSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: INGBank -> Euro')
  }
}

export async function getIngBankEURUSD() {
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

    const setEURUSD = getDoc.update({
      bank_eurusd_buy: fixNumber(fixNumber(resEURBuy) / fixNumber(resUSDBuy)),
      bank_eurusd_sell: fixNumber(
        fixNumber(resEURSell) / fixNumber(resUSDSell),
      ),
      bank_eurusd_rate: fixNumber(
        fixNumber(fixNumber(resEURSell) / fixNumber(resUSDSell)) -
        fixNumber(fixNumber(resEURBuy) / fixNumber(resUSDBuy)),
      ),
      bank_eurusd_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `IngBank - EUR/USD = Alış : ${fixNumber(
        fixNumber(resEURBuy) / fixNumber(resUSDBuy),
      )} $ / Satış: ${fixNumber(
        fixNumber(resEURSell) / fixNumber(resUSDSell),
      )} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: INGBank -> Euro/Dolar')
  }
}

export async function getIngBankGAU() {
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

    const setGAU = getDoc.update({
      bank_gau_buy: fixNumber(resGAUBuy),
      bank_gau_sell: fixNumber(resGAUSell),
      bank_gau_rate: fixNumber(fixNumber(resGAUSell) - fixNumber(resGAUBuy)),
      bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `IngBank - GAU = Alış : ${resGAUBuy} TL / Satış: ${resGAUSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: INGBank -> Altın')
  }
}

export default function getIngBankForex() {
  return (
    getIngBankUSD() + getIngBankEUR() + getIngBankGAU() + getIngBankEURUSD()
  )
}