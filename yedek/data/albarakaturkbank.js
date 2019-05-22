import axios from 'axios'
import TegAction from './../functions/telegram'
import fire from './../functions/firestore'
import fixNumber from './../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_albarakaturkbank')
const setBankData = getDoc.update({
  bank_name: 'Albaraka Türk',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Falbarakaturk_logo.png?alt=media&token=35a1ae53-dab7-4d8b-9005-2dd9bcca3bf6',
})

// const getURL = 'https://www.albaraka.com.tr/forms/foreks.json'
const getURL = 'https://www.albaraka.com.tr/forms/currency.json'

export async function getAlBarakaTurkBankUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resUSDBuy = resData[0]['Alis']
    const resUSDSell = resData[0]['Satis']

    const setUSD = getDoc.update({
      bank_usd_buy: fixNumber(resUSDBuy),
      bank_usd_sell: fixNumber(resUSDSell),
      bank_usd_rate: fixNumber(fixNumber(resUSDSell) - fixNumber(resUSDBuy)),
      bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `AlBarakaTurkBank - USD = Alış : ${resUSDBuy} TL / Satış: ${resUSDSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: AlBaraka Türk -> Dolar')
  }
}

export async function getAlBarakaTurkBankEUR() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resEURBuy = resData[1]['Alis']
    const resEURSell = resData[1]['Satis']

    const setEUR = getDoc.update({
      bank_eur_buy: fixNumber(resEURBuy),
      bank_eur_sell: fixNumber(resEURSell),
      bank_eur_rate: fixNumber(fixNumber(resEURSell) - fixNumber(resEURBuy)),
      bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `AlBarakaTurkBank - EUR = Alış : ${resEURBuy} TL / Satış: ${resEURSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: AlBaraka Türk -> Euro')
  }
}

export async function getAlBarakaTurkBankEURUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resEURBuy = resData[1]['Alis']
    const resEURSell = resData[1]['Satis']
    const resUSDBuy = resData[0]['Alis']
    const resUSDSell = resData[0]['Satis']

    const setEURUSD = getDoc.update({
      bank_eurusd_buy: fixNumber(fixNumber(resEURBuy) / fixNumber(resUSDBuy)),
      bank_eurusd_sell: fixNumber(
        fixNumber(resEURSell) / fixNumber(resUSDSell),
      ),
      bank_eurusd_rate: fixNumber(
        fixNumber(fixNumber(resEURSell) / fixNumber(resUSDSell)) -
        fixNumber(fixNumber(resEURBuy) / fixNumber(resUSDBuy)),
      ),
      bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `AlBarakaTurkBank - EUR/USD = Alış : ${fixNumber(
        fixNumber(resEURBuy) / fixNumber(resUSDBuy),
      )} TL / Satış: ${fixNumber(
        fixNumber(resEURSell) / fixNumber(resUSDSell),
      )} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: AlBaraka Türk -> Euro/Dolar')
  }
}

export async function getAlBarakaTurkBankGAU() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resGAUBuy = resData[2]['Alis']
    const resGAUSell = resData[2]['Satis']

    const setGAU = getDoc.update({
      bank_gau_buy: fixNumber(resGAUBuy),
      bank_gau_sell: fixNumber(resGAUSell),
      bank_gau_rate: fixNumber(fixNumber(resGAUSell) - fixNumber(resGAUBuy)),
      bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `AlBarakaTurkBank - GAU = Alış : ${resGAUBuy} TL / Satış: ${resGAUSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: AlBaraka Türk -> Altın')
  }
}

export default function getAlBarakaTurkBankForex() {
  return (
    getAlBarakaTurkBankUSD() +
    getAlBarakaTurkBankEUR() +
    getAlBarakaTurkBankGAU() +
    getAlBarakaTurkBankEURUSD()
  )
}