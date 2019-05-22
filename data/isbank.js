import axios from 'axios'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()
const getDoc = db.collection('fxt_bank').doc('fxt_isbank')
const setBankData = getDoc.update({
  bank_name: 'İş Bank',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fis_logo.jpg?alt=media&token=d763dc78-d50a-4c8c-b3e7-6f47b54a233d',
})

let fixUTCMonth = new Date().getUTCMonth()

let fixUTCFullTime =
  new Date().getUTCFullYear() +
  '-' +
  ++fixUTCMonth +
  '-' +
  new Date().getUTCDate()

let fixUTCFullTimeConvert = Date.now()

const getURL =
  'https://www.isbank.com.tr/_layouts/ISB_DA/HttpHandlers/FxRatesHandler.ashx?Lang=tr&fxRateType=INTERACTIVE&date=' +
  fixUTCFullTime +
  '&time=' +
  fixUTCFullTimeConvert +
  ''

export async function getIsBankUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resUSDBuy = resData[0]['fxRateBuy']
    const resUSDSell = resData[0]['fxRateSell']

    const setUSD = getDoc.update({
      bank_usd_buy: fixNumber(resUSDBuy),
      bank_usd_sell: fixNumber(resUSDSell),
      bank_usd_rate: fixNumber(fixNumber(resUSDSell) - fixNumber(resUSDBuy)),
      bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `IsBank - USD = Alış : ${resUSDBuy} TL / Satış: ${resUSDSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: IsBank -> Dolar')
  }
}

export async function getIsBankEUR() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resEURBuy = resData[1]['fxRateBuy']
    const resEURSell = resData[1]['fxRateSell']

    const setEUR = getDoc.update({
      bank_eur_buy: fixNumber(resEURBuy),
      bank_eur_sell: fixNumber(resEURSell),
      bank_eur_rate: fixNumber(fixNumber(resEURSell) - fixNumber(resEURBuy)),
      bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `IsBank - EUR = Alış : ${resEURBuy} TL / Satış: ${resEURSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: IsBank -> Euro')
  }
}

export async function getIsBankEURUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resEURBuy = resData[1]['fxRateBuy']
    const resEURSell = resData[1]['fxRateSell']
    const resUSDBuy = resData[0]['fxRateBuy']
    const resUSDSell = resData[0]['fxRateSell']

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
      `IsBank - EUR/USD = Alış : ${fixNumber(
        fixNumber(resEURBuy) / fixNumber(resUSDBuy),
      )} $ / Satış: ${fixNumber(
        fixNumber(resEURSell) / fixNumber(resUSDSell),
      )} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: IsBank -> Euro/Dolar')
  }
}

export default function getIsBankForex() {
  return getIsBankUSD() + getIsBankEUR() + getIsBankEURUSD()
}
