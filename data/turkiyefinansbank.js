import axios from 'axios'
import cheerio from 'cheerio'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_turkiyefinansbank')
const setBankData = getDoc.update({
  bank_name: 'Türkiye Finans',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Ftfkb_logo.jpg?alt=media&token=5a73ba24-958b-4abf-8c17-a14574fe6ffa',
})

const getURL =
  'https://www.turkiyefinans.com.tr/tr-tr/bireysel/yatirim-hizmetleri/Sayfalar/kiymetli-maden-ve-doviz-fiyatlari.aspx'

async function getHTML(url) {
  try {
    const { data: html } = await axios({
      method: 'get',
      url: getURL,
      timeout: 5000,
    })
    return html
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: Türkiye Finans Bankası')
  }
}

async function getTurkiyeFinansBankAlisUSD(html) {
  const $ = cheerio.load(html)
  const TurkiyeFinansBankAlisUSD = $(
    'span#ctl00_ctl38_g_efb80e8c_c74c_4852_9eaf_0d034f0c63a5_kiymetliMadenRepeater_ctl00_buyPriceLbl',
  ).text()
  return TurkiyeFinansBankAlisUSD
}

async function getTurkiyeFinansBankSatisUSD(html) {
  const $ = cheerio.load(html)
  const TurkiyeFinansBankSatisUSD = $(
    'span#ctl00_ctl38_g_efb80e8c_c74c_4852_9eaf_0d034f0c63a5_kiymetliMadenRepeater_ctl00_sellPriceLbl',
  ).text()
  return TurkiyeFinansBankSatisUSD
}

export async function getTurkiyeFinansBankUSD() {
  const html = await getHTML(getURL)
  const pTurkiyeFinansBankAlisUSD = await getTurkiyeFinansBankAlisUSD(html)
  const pTurkiyeFinansBankSatisUSD = await getTurkiyeFinansBankSatisUSD(html)

  const setUSD = getDoc.update({
    bank_usd_buy: fixNumber(pTurkiyeFinansBankAlisUSD),
    bank_usd_sell: fixNumber(pTurkiyeFinansBankSatisUSD),
    bank_usd_rate: fixNumber(
      fixNumber(pTurkiyeFinansBankSatisUSD) -
      fixNumber(pTurkiyeFinansBankAlisUSD),
    ),
    bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `TurkiyeFinansBank - USD = Alış : ${pTurkiyeFinansBankAlisUSD} TL / Satış: ${pTurkiyeFinansBankSatisUSD} TL`,
  )
}

async function getTurkiyeFinansBankAlisEUR(html) {
  const $ = cheerio.load(html)
  const TurkiyeFinansBankAlisEUR = $(
    'span#ctl00_ctl38_g_efb80e8c_c74c_4852_9eaf_0d034f0c63a5_kiymetliMadenRepeater_ctl11_buyPriceLbl',
  ).text()
  return TurkiyeFinansBankAlisEUR
}

async function getTurkiyeFinansBankSatisEUR(html) {
  const $ = cheerio.load(html)
  const TurkiyeFinansBankSatisEUR = $(
    'span#ctl00_ctl38_g_efb80e8c_c74c_4852_9eaf_0d034f0c63a5_kiymetliMadenRepeater_ctl11_sellPriceLbl',
  ).text()
  return TurkiyeFinansBankSatisEUR
}

export async function getTurkiyeFinansBankEUR() {
  const html = await getHTML(getURL)
  const pTurkiyeFinansBankAlisEUR = await getTurkiyeFinansBankAlisEUR(html)
  const pTurkiyeFinansBankSatisEUR = await getTurkiyeFinansBankSatisEUR(html)

  const setEUR = getDoc.update({
    bank_eur_buy: fixNumber(pTurkiyeFinansBankAlisEUR),
    bank_eur_sell: fixNumber(pTurkiyeFinansBankSatisEUR),
    bank_eur_rate: fixNumber(
      fixNumber(pTurkiyeFinansBankSatisEUR) -
      fixNumber(pTurkiyeFinansBankAlisEUR),
    ),
    bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `TurkiyeFinansBank - EUR = Alış : ${pTurkiyeFinansBankAlisEUR} TL / Satış: ${pTurkiyeFinansBankSatisEUR} TL`,
  )
}

export async function getTurkiyeFinansBankEURUSD() {
  const html = await getHTML(getURL)
  const pTurkiyeFinansBankAlisEUR = await getTurkiyeFinansBankAlisEUR(html)
  const pTurkiyeFinansBankSatisEUR = await getTurkiyeFinansBankSatisEUR(html)
  const pTurkiyeFinansBankAlisUSD = await getTurkiyeFinansBankAlisUSD(html)
  const pTurkiyeFinansBankSatisUSD = await getTurkiyeFinansBankSatisUSD(html)

  const setEURUSD = getDoc.update({
    bank_eurusd_buy: fixNumber(
      fixNumber(pTurkiyeFinansBankAlisEUR) /
      fixNumber(pTurkiyeFinansBankAlisUSD),
    ),
    bank_eurusd_sell: fixNumber(
      fixNumber(pTurkiyeFinansBankSatisEUR) /
      fixNumber(pTurkiyeFinansBankSatisUSD),
    ),
    bank_eurusd_rate: fixNumber(
      fixNumber(
        fixNumber(pTurkiyeFinansBankSatisEUR) /
        fixNumber(pTurkiyeFinansBankSatisUSD),
      ) -
      fixNumber(
        fixNumber(pTurkiyeFinansBankAlisEUR) /
        fixNumber(pTurkiyeFinansBankAlisUSD),
      ),
    ),
    bank_eurusd_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `TurkiyeFinansBank - EUR/USD = Alış : ${fixNumber(
      fixNumber(pTurkiyeFinansBankAlisEUR) /
      fixNumber(pTurkiyeFinansBankAlisUSD),
    )} $ / Satış: ${fixNumber(
      fixNumber(pTurkiyeFinansBankSatisEUR) /
      fixNumber(pTurkiyeFinansBankSatisUSD),
    )} $`,
  )
}

async function getTurkiyeFinansBankAlisGAU(html) {
  const $ = cheerio.load(html)
  const TurkiyeFinansBankAlisGAU = $(
    'span#ctl00_ctl38_g_efb80e8c_c74c_4852_9eaf_0d034f0c63a5_kiymetliMadenRepeater_ctl14_buyPriceLbl',
  ).text()
  return TurkiyeFinansBankAlisGAU
}

async function getTurkiyeFinansBankSatisGAU(html) {
  const $ = cheerio.load(html)
  const TurkiyeFinansBankSatisGAU = $(
    'span#ctl00_ctl38_g_efb80e8c_c74c_4852_9eaf_0d034f0c63a5_kiymetliMadenRepeater_ctl14_sellPriceLbl',
  ).text()
  return TurkiyeFinansBankSatisGAU
}

export async function getTurkiyeFinansBankGAU() {
  const html = await getHTML(getURL)
  const pTurkiyeFinansBankAlisGAU = await getTurkiyeFinansBankAlisGAU(html)
  const pTurkiyeFinansBankSatisGAU = await getTurkiyeFinansBankSatisGAU(html)

  const setGAU = getDoc.update({
    bank_gau_buy: fixNumber(pTurkiyeFinansBankAlisGAU),
    bank_gau_sell: fixNumber(pTurkiyeFinansBankSatisGAU),
    bank_gau_rate: fixNumber(
      fixNumber(pTurkiyeFinansBankSatisGAU) -
      fixNumber(pTurkiyeFinansBankAlisGAU),
    ),
    bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `TurkiyeFinansBank - GAU = Alış : ${pTurkiyeFinansBankAlisGAU} TL / Satış: ${pTurkiyeFinansBankSatisGAU} TL`,
  )
}

export default function getTurkiyeFinansBankForex() {
  return (
    getTurkiyeFinansBankUSD() +
    getTurkiyeFinansBankEUR() +
    getTurkiyeFinansBankGAU() +
    getTurkiyeFinansBankEURUSD()
  )
}
