import axios from 'axios'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_kuveytturkbank')
const setBankData = getDoc.update({
  bank_name: 'Kuveyt Türk',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fkuveyt_logo.jpg?alt=media&token=e83a1f80-994c-49e3-83ef-d59274e7a0f8',
})

const getURL = 'https://www.kuveytturk.com.tr/FinancePortal/Exchange/GetAll'

export async function getKuveytTurkBankUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resUSDBuy = resData[1]['BuyRate']
    const resUSDSell = resData[1]['SellRate']

    const setUSD = getDoc.update({
      bank_usd_buy: fixNumber(resUSDBuy),
      bank_usd_sell: fixNumber(resUSDSell),
      bank_usd_rate: fixNumber(fixNumber(resUSDSell) - fixNumber(resUSDBuy)),
      bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `KuveytTurkBank - USD = Alış : ${resUSDBuy} TL / Satış: ${resUSDSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: Kuveyt Turk Bank -> Dolar')
  }
}

export async function getKuveytTurkBankEUR() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resEURBuy = resData[2]['BuyRate']
    const resEURSell = resData[2]['SellRate']

    const setEUR = getDoc.update({
      bank_eur_buy: fixNumber(resEURBuy),
      bank_eur_sell: fixNumber(resEURSell),
      bank_eur_rate: fixNumber(fixNumber(resEURSell) - fixNumber(resEURBuy)),
      bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `KuveytTurkBank - EUR = Alış : ${resEURBuy} TL / Satış: ${resEURSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: Kuveyt Turk Bank -> Euro')
  }
}

export async function getKuveytTurkBankEURUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resEURBuy = resData[2]['BuyRate']
    const resEURSell = resData[2]['SellRate']
    const resUSDBuy = resData[1]['BuyRate']
    const resUSDSell = resData[1]['SellRate']

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
      `KuveytTurkBank - EUR/USD = Alış : ${fixNumber(
        fixNumber(resEURBuy) / fixNumber(resUSDBuy),
      )} $ / Satış: ${fixNumber(
        fixNumber(resEURSell) / fixNumber(resUSDSell),
      )} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction(
      767580569,
      'Hey Profesör! Problem: Kuveyt Turk Bank -> Euro/Dolar',
    )
  }
}

export async function getKuveytTurkBankGAU() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data
    const resGAUBuy = resData[3]['BuyRate']
    const resGAUSell = resData[3]['SellRate']

    const setGAU = getDoc.update({
      bank_gau_buy: fixNumber(resGAUBuy),
      bank_gau_sell: fixNumber(resGAUSell),
      bank_gau_rate: fixNumber(fixNumber(resGAUSell) - fixNumber(resGAUBuy)),
      bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `KuveytTurkBank - GAU = Alış : ${resGAUBuy} TL / Satış: ${resGAUSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: Kuveyt Turk Bank -> Altın')
  }
}

export default function getKuveytTurkBankForex() {
  return (
    getKuveytTurkBankUSD() +
    getKuveytTurkBankEUR() +
    getKuveytTurkBankGAU() +
    getKuveytTurkBankEURUSD()
  )
}