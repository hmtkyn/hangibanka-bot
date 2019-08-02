import axios from 'axios'
import TegAction from './../functions/telegram'
import fire from './../functions/firestore'
import fixNumber from '../functions/numberfix'

// Firestore
const db = fire.firestore()
const getDoc = db.collection('fxt_bank').doc('fxt_akbank')

const setBankData = getDoc.update({
  bank_name: 'Akbank',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fakbank_logo.jpg?alt=media&token=443bce8b-8732-4ed3-bd88-87500ae1db01',
})

/* const getURL =
  'https://www.akbank.com/_vti_bin/AkbankServicesSecure/FrontEndServiceSecure.svc/GetExchangeData' */

const getURL = 'https://www.akbank.com/_vti_bin/AkbankServicesSecure/FrontEndServiceSecure.svc/GetCurrencyRates'

export async function getAkBankUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = JSON.parse(response.data.GetCurrencyRatesResult)
    const resUSDBuy = resData['cur'][33]['DovizAlis']
    const resUSDSell = resData['cur'][33]['DovizSatis']

    const setUSD = getDoc.update({
      bank_usd_buy: fixNumber(resUSDBuy),
      bank_usd_sell: fixNumber(resUSDSell),
      bank_usd_rate: fixNumber(fixNumber(resUSDSell) - fixNumber(resUSDBuy)),
      bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `AkBank - USD = Alış : ${resUSDBuy} TL / Satış: ${resUSDSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: AkBank -> Dolar')
  }
}

export async function getAkBankEUR() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = JSON.parse(response.data.GetCurrencyRatesResult)
    const resEURBuy = resData['cur'][13]['DovizAlis']
    const resEURSell = resData['cur'][13]['DovizSatis']

    const setEUR = getDoc.update({
      bank_eur_buy: fixNumber(resEURBuy),
      bank_eur_sell: fixNumber(resEURSell),
      bank_eur_rate: fixNumber(fixNumber(resEURSell) - fixNumber(resEURBuy)),
      bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `AkBank - EUR = Alış : ${resEURBuy} TL / Satış: ${resEURSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: AkBank -> Euro')
  }
}

export async function getAkBankEURUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = JSON.parse(response.data.GetCurrencyRatesResult)
    const resEURBuy = resData['cur'][13]['DovizAlis']
    const resEURSell = resData['cur'][13]['DovizSatis']
    const resUSDBuy = resData['cur'][33]['DovizAlis']
    const resUSDSell = resData['cur'][33]['DovizSatis']

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
      `AkBank - EUR/USD = Alış : ${fixNumber(
        fixNumber(resEURBuy) / fixNumber(resUSDBuy),
      )} $ / Satış: ${fixNumber(
        fixNumber(resEURSell) / fixNumber(resUSDSell),
      )} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: AkBank -> Euro/Dolar')
  }
}

export async function getAkBankGAU() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = JSON.parse(response.data.GetCurrencyRatesResult)
    const resGAUBuy = resData['cur'][35]['DovizAlis']
    const resGAUSell = resData['cur'][35]['DovizSatis']

    const setGAU = getDoc.update({
      bank_gau_buy: fixNumber(resGAUBuy),
      bank_gau_sell: fixNumber(resGAUSell),
      bank_gau_rate: fixNumber(fixNumber(resGAUSell) - fixNumber(resGAUBuy)),
      bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `AkBank - GAU = Alış : ${resGAUBuy} TL / Satış: ${resGAUSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: AkBank -> GAU')
  }
}

export default function getAkbankForex() {
  return getAkBankUSD() + getAkBankEUR() + getAkBankGAU() + getAkBankEURUSD()
}