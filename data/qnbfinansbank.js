import axios from 'axios'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_qnbfinansbank')
const setBankData = getDoc.update({
  bank_name: 'QNB Finans',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fqnb_finans_logo.jpg?alt=media&token=ac4fc61b-60e8-4bf0-b230-6c037abbde81',
})

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

    const setUSD = getDoc.update({
      bank_usd_buy: fixNumber(resUSDBuy),
      bank_usd_sell: fixNumber(resUSDSell),
      bank_usd_rate: fixNumber(fixNumber(resUSDSell) - fixNumber(resUSDBuy)),
      bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `QNBFinansBank - USD = Alış : ${resUSDBuy} TL / Satış: ${resUSDSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: QNB FinansBank -> Dolar')
  }
}

export async function getQNBFinansBankEUR() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resEURBuy = resData[1]['effectiveBuyingExchangeRateField']
    const resEURSell = resData[1]['effectiveSellingExchangeRateField']

    const setEUR = getDoc.update({
      bank_eur_buy: fixNumber(resEURBuy),
      bank_eur_sell: fixNumber(resEURSell),
      bank_eur_rate: fixNumber(fixNumber(resEURSell) - fixNumber(resEURBuy)),
      bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
    })
    console.log(
      `QNBFinansBank - EUR = Alış : ${resEURBuy} TL / Satış: ${resEURSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: QNB FinansBank -> Euro')
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
      `QNBFinansBank - EUR/USD = Alış : ${fixNumber(
        fixNumber(resEURBuy) / fixNumber(resUSDBuy),
      )} $ / Satış: ${fixNumber(
        fixNumber(resEURSell) / fixNumber(resUSDSell),
      )} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: QNB FinansBank -> Euro/Dolar')
  }
}

export async function getQNBFinansBankGAU() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resGAUBuy = resData[16]['effectiveBuyingExchangeRateField']
    const resGAUSell = resData[16]['effectiveSellingExchangeRateField']

    const setGAU = getDoc.update({
      bank_gau_buy: fixNumber(resGAUBuy),
      bank_gau_sell: fixNumber(resGAUSell),
      bank_gau_rate: fixNumber(fixNumber(resGAUSell) - fixNumber(resGAUBuy)),
      bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
    })
    console.log(
      `QNBFinansBank - GAU = Alış : ${resGAUBuy} TL / Satış: ${resGAUSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: QNB FinansBank -> Altın')
  }
}

export default function getQNBFinansBankForex() {
  return (
    getQNBFinansBankUSD() +
    getQNBFinansBankEUR() +
    getQNBFinansBankGAU() +
    getQNBFinansBankEURUSD()
  )
}