import axios from 'axios'
import cheerio from 'cheerio'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_denizbank')
const setBankData = getDoc.update({
  bank_name: 'Denizbank',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fdenizbank_logo.jpg?alt=media&token=60c42832-e9fb-49c3-925f-e18d82864686',
})

const getURL =
  'https://www.denizbank.com/oran-ve-fiyatlar/denizbank-kur-bilgileri.aspx'

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
    TegAction(767580569, 'Hey Profesör! Problem: DenizBank')
  }
}

async function getDenizBankAlisUSD(html) {
  const $ = cheerio.load(html)
  const DenizBankAlisUSD = $(
    'table.table > tbody > tr:nth-child(1) > td.right:nth-child(2)',
  ).text()
  return DenizBankAlisUSD
}

async function getDenizBankSatisUSD(html) {
  const $ = cheerio.load(html)
  const DenizBankSatisUSD = $(
    'table.table > tbody > tr:nth-child(1) > td.right:nth-child(3)',
  ).text()
  return DenizBankSatisUSD
}

export async function getDenizBankUSD() {
  const html = await getHTML(getURL)
  const pDenizBankAlisUSD = await getDenizBankAlisUSD(html)
  const pDenizBankSatisUSD = await getDenizBankSatisUSD(html)

  const setUSD = getDoc.update({
    bank_usd_buy: fixNumber(pDenizBankAlisUSD),
    bank_usd_sell: fixNumber(pDenizBankSatisUSD),
    bank_usd_rate: fixNumber(
      fixNumber(pDenizBankSatisUSD) - fixNumber(pDenizBankAlisUSD),
    ),
    bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `DenizBank - USD = Alış : ${pDenizBankAlisUSD} TL / Satış: ${pDenizBankSatisUSD} TL`,
  )
}

async function getDenizBankAlisEUR(html) {
  const $ = cheerio.load(html)
  const DenizBankAlisEUR = $(
    'table.table > tbody > tr:nth-child(2) > td.right:nth-child(2)',
  ).text()
  return DenizBankAlisEUR
}

async function getDenizBankSatisEUR(html) {
  const $ = cheerio.load(html)
  const DenizBankSatisEUR = $(
    'table.table > tbody > tr:nth-child(2) > td.right:nth-child(3)',
  ).text()
  return DenizBankSatisEUR
}

export async function getDenizBankEUR() {
  const html = await getHTML(getURL)
  const pDenizBankAlisEUR = await getDenizBankAlisEUR(html)
  const pDenizBankSatisEUR = await getDenizBankSatisEUR(html)

  const setEUR = getDoc.update({
    bank_eur_buy: fixNumber(pDenizBankAlisEUR),
    bank_eur_sell: fixNumber(pDenizBankSatisEUR),
    bank_eur_rate: fixNumber(
      fixNumber(pDenizBankSatisEUR) - fixNumber(pDenizBankAlisEUR),
    ),
    bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `DenizBank - EUR = Alış : ${pDenizBankAlisEUR} TL / Satış: ${pDenizBankSatisEUR} TL`,
  )
}

export async function getDenizBankEURUSD() {
  const html = await getHTML(getURL)
  const pDenizBankAlisEUR = await getDenizBankAlisEUR(html)
  const pDenizBankSatisEUR = await getDenizBankSatisEUR(html)
  const pDenizBankAlisUSD = await getDenizBankAlisUSD(html)
  const pDenizBankSatisUSD = await getDenizBankSatisUSD(html)

  const setEURUSD = getDoc.update({
    bank_eurusd_buy: fixNumber(
      fixNumber(pDenizBankAlisEUR) / fixNumber(pDenizBankAlisUSD),
    ),
    bank_eurusd_sell: fixNumber(
      fixNumber(pDenizBankSatisEUR) / fixNumber(pDenizBankSatisUSD),
    ),
    bank_eurusd_rate: fixNumber(
      fixNumber(fixNumber(pDenizBankSatisEUR) / fixNumber(pDenizBankSatisUSD)) -
      fixNumber(fixNumber(pDenizBankAlisEUR) / fixNumber(pDenizBankAlisUSD)),
    ),
    bank_eurusd_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `DenizBank - EUR/USD = Alış : ${fixNumber(
      fixNumber(pDenizBankAlisEUR) / fixNumber(pDenizBankAlisUSD),
    )} TL / Satış: ${fixNumber(
      fixNumber(pDenizBankSatisEUR) / fixNumber(pDenizBankSatisUSD),
    )} TL`,
  )
}

async function getDenizBankAlisGAU(html) {
  const $ = cheerio.load(html)
  const DenizBankAlisGAU = $(
    'table.table > tbody > tr:nth-child(13) > td.right:nth-child(2)',
  ).text()
  return DenizBankAlisGAU
}

async function getDenizBankSatisGAU(html) {
  const $ = cheerio.load(html)
  const DenizBankSatisGAU = $(
    'table.table > tbody > tr:nth-child(13) > td.right:nth-child(3)',
  ).text()
  return DenizBankSatisGAU
}

export async function getDenizBankGAU() {
  const html = await getHTML(getURL)
  const pDenizBankAlisGAU = await getDenizBankAlisGAU(html)
  const pDenizBankSatisGAU = await getDenizBankSatisGAU(html)

  const setGAU = getDoc.update({
    bank_gau_buy: fixNumber(pDenizBankAlisGAU),
    bank_gau_sell: fixNumber(pDenizBankSatisGAU),
    bank_gau_rate: fixNumber(
      fixNumber(pDenizBankSatisGAU) - fixNumber(pDenizBankAlisGAU),
    ),
    bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `DenizBank - GAU = Alış : ${pDenizBankAlisGAU} TL / Satış: ${pDenizBankSatisGAU} TL`,
  )
}

export default function getDenizBankForex() {
  return (
    getDenizBankUSD() +
    getDenizBankEUR() +
    getDenizBankGAU() +
    getDenizBankEURUSD()
  )
}