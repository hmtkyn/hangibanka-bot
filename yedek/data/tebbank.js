import axios from 'axios'
import cheerio from 'cheerio'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_tebbank')
const setBankData = getDoc.update({
  bank_name: 'TEB',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fteb_logo.jpg?alt=media&token=1a6505d2-9ba4-4caf-abd4-82e1a0539786',
})

const getURL = 'https://www.cepteteb.com.tr/services/GetGunlukDovizKur'

export async function getTEBBankUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data.result
    const resUSDBuy = resData[0]['tebAlis']
    const resUSDSell = resData[0]['tebSatis']

    const setUSD = getDoc.update({
      bank_usd_buy: fixNumber(resUSDBuy),
      bank_usd_sell: fixNumber(resUSDSell),
      bank_usd_rate: fixNumber(fixNumber(resUSDSell) - fixNumber(resUSDBuy)),
      bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `TEBBank - USD = Alış : ${resUSDBuy} TL / Satış: ${resUSDSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: TEB Bank -> Dolar')
  }
}

export async function getTEBBankEUR() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data.result
    const resEURBuy = resData[1]['tebAlis']
    const resEURSell = resData[1]['tebSatis']

    const setEUR = getDoc.update({
      bank_eur_buy: fixNumber(resEURBuy),
      bank_eur_sell: fixNumber(resEURSell),
      bank_eur_rate: fixNumber(fixNumber(resEURSell) - fixNumber(resEURBuy)),
      bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `TEBBank - EUR = Alış : ${resEURBuy} TL / Satış: ${resEURSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: TEB Bank -> Euro')
  }
}

export async function getTEBBankEURUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = response.data.result
    const resEURBuy = resData[1]['tebAlis']
    const resEURSell = resData[1]['tebSatis']
    const resUSDBuy = resData[0]['tebAlis']
    const resUSDSell = resData[0]['tebSatis']

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
      `TEBBank - EUR/USD = Alış : ${fixNumber(
        fixNumber(resEURBuy) / fixNumber(resUSDBuy),
      )} $ / Satış: ${fixNumber(
        fixNumber(resEURSell) / fixNumber(resUSDSell),
      )} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: TEB Bank -> Euro/Dolar')
  }
}

const getGAUUrl = 'https://www.cepteteb.com.tr/altin-kurlari'

async function getHTML(url) {
  try {
    const { data: html } = await axios({
      method: 'get',
      url: getGAUUrl,
      timeout: 5000,
    })
    return html
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: TEB Bank -> Altın')
  }
}

async function getTEBBankAlisGAU(html) {
  const $ = cheerio.load(html)
  const TEBBankAlisGAU = $(
    'table#altinTablo > tbody > tr:nth-child(1) > td:nth-child(2)',
  ).text()
  return TEBBankAlisGAU
}

async function getTEBBankSatisGAU(html) {
  const $ = cheerio.load(html)
  const TEBBankSatisGAU = $(
    'table#altinTablo > tbody > tr:nth-child(1) > td:nth-child(3)',
  ).text()
  return TEBBankSatisGAU
}

export async function getTEBBankGAU() {
  const html = await getHTML(getURL)
  const pTEBBankAlisGAU = await getTEBBankAlisGAU(html)
  const pTEBBankSatisGAU = await getTEBBankSatisGAU(html)

  const setGAU = getDoc.update({
    bank_gau_buy: fixNumber(pTEBBankAlisGAU),
    bank_gau_sell: fixNumber(pTEBBankSatisGAU),
    bank_gau_rate: fixNumber(
      fixNumber(pTEBBankSatisGAU) - fixNumber(pTEBBankAlisGAU),
    ),
    bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `TEBBank - GAU = Alış : ${pTEBBankAlisGAU} / Satış: ${pTEBBankSatisGAU}`,
  )
}

export default function getTEBBankForex() {
  return (
    getTEBBankUSD() + getTEBBankEUR() + getTEBBankGAU() + getTEBBankEURUSD()
  )
}
