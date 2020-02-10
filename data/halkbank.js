import axios from 'axios'
import cheerio from 'cheerio'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_halkbank')
const setBankData = getDoc.update({
  bank_name: 'HalkBank',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fhalk_logo.jpg?alt=media&token=a20ee709-45a8-4835-b58d-1a7f6ae41a89',
})

const getURL = 'https://www.halkbank.com.tr'

async function getHTML(url) {
  try {
    const { data: html } = await axios({
      method: 'get',
      url: getURL,
      timeout: 5000,
    })
    return html
  } catch (error) {
    TegAction(767580569, 'Hey Profesör! Problem: Halkbank')
  }
}

async function getHalkBankAlisUSD(html) {
  const $ = cheerio.load(html)
  const HalkBankAlisUSD = $(
    'div#tab_ic_piyasa > table > tbody > tr:nth-child(1) > td:nth-child(3)',
  ).text()
  return HalkBankAlisUSD
}

async function getHalkBankSatisUSD(html) {
  const $ = cheerio.load(html)
  const HalkBankSatisUSD = $(
    'div#tab_ic_piyasa > table > tbody > tr:nth-child(1) > td:nth-child(4)',
  ).text()
  return HalkBankSatisUSD
}

export async function getHalkBankUSD() {
  const html = await getHTML(getURL)
  const pHalkBankAlisUSD = await getHalkBankAlisUSD(html)
  const pHalkBankSatisUSD = await getHalkBankSatisUSD(html)

  const setUSD = getDoc.update({
    bank_usd_buy: fixNumber(pHalkBankAlisUSD),
    bank_usd_sell: fixNumber(pHalkBankSatisUSD),
    bank_usd_rate: fixNumber(
      fixNumber(pHalkBankSatisUSD) - fixNumber(pHalkBankAlisUSD),
    ),
    bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `HalkBank - USD = Alış : ${pHalkBankAlisUSD} TL / Satış: ${pHalkBankSatisUSD} TL`,
  )
}

async function getHalkBankAlisEUR(html) {
  const $ = cheerio.load(html)
  const HalkBankAlisEUR = $(
    'div#tab_ic_piyasa > table > tbody > tr:nth-child(2) > td:nth-child(3)',
  ).text()
  return HalkBankAlisEUR
}

async function getHalkBankSatisEUR(html) {
  const $ = cheerio.load(html)
  const HalkBankSatisEUR = $(
    'div#tab_ic_piyasa > table > tbody > tr:nth-child(2) > td:nth-child(4)',
  ).text()
  return HalkBankSatisEUR
}

export async function getHalkBankEUR() {
  const html = await getHTML(getURL)
  const pHalkBankAlisEUR = await getHalkBankAlisEUR(html)
  const pHalkBankSatisEUR = await getHalkBankSatisEUR(html)

  const setEUR = getDoc.update({
    bank_eur_buy: fixNumber(pHalkBankAlisEUR),
    bank_eur_sell: fixNumber(pHalkBankSatisEUR),
    bank_eur_rate: fixNumber(
      fixNumber(pHalkBankSatisEUR) - fixNumber(pHalkBankAlisEUR),
    ),
    bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `HalkBank - EUR = Alış : ${pHalkBankAlisEUR} TL / Satış: ${pHalkBankSatisEUR} TL`,
  )
}

export async function getHalkBankEURUSD() {
  const html = await getHTML(getURL)
  const pHalkBankAlisEUR = await getHalkBankAlisEUR(html)
  const pHalkBankSatisEUR = await getHalkBankSatisEUR(html)
  const pHalkBankAlisUSD = await getHalkBankAlisUSD(html)
  const pHalkBankSatisUSD = await getHalkBankSatisUSD(html)

  const setEURUSD = getDoc.update({
    bank_eurusd_buy: fixNumber(
      fixNumber(pHalkBankAlisEUR) / fixNumber(pHalkBankAlisUSD),
    ),
    bank_eurusd_sell: fixNumber(
      fixNumber(pHalkBankSatisEUR) / fixNumber(pHalkBankSatisUSD),
    ),
    bank_eurusd_rate: fixNumber(
      fixNumber(fixNumber(pHalkBankSatisEUR) / fixNumber(pHalkBankSatisUSD)) -
      fixNumber(fixNumber(pHalkBankAlisEUR) / fixNumber(pHalkBankAlisUSD)),
    ),
    bank_eurusd_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `HalkBank - EUR/USD = Alış : ${fixNumber(
      fixNumber(pHalkBankAlisEUR) / fixNumber(pHalkBankAlisUSD),
    )} $ / Satış: ${fixNumber(
      fixNumber(pHalkBankSatisEUR) / fixNumber(pHalkBankSatisUSD),
    )} $`,
  )
}

async function getHalkBankAlisGAU(html) {
  const $ = cheerio.load(html)
  const HalkBankAlisGAU = $(
    'div#tab_ic_piyasa > table > tbody > tr:nth-child(4) > td:nth-child(3)',
  ).text()
  return HalkBankAlisGAU
}

async function getHalkBankSatisGAU(html) {
  const $ = cheerio.load(html)
  const HalkBankSatisGAU = $(
    'div#tab_ic_piyasa > table > tbody > tr:nth-child(4) > td:nth-child(4)',
  ).text()
  return HalkBankSatisGAU
}

export async function getHalkBankGAU() {
  const html = await getHTML(getURL)
  const pHalkBankAlisGAU = await getHalkBankAlisGAU(html)
  const pHalkBankSatisGAU = await getHalkBankSatisGAU(html)

  const setGAU = getDoc.update({
    bank_gau_buy: fixNumber(pHalkBankAlisGAU),
    bank_gau_sell: fixNumber(pHalkBankSatisGAU),
    bank_gau_rate: fixNumber(
      fixNumber(pHalkBankSatisGAU) - fixNumber(pHalkBankAlisGAU),
    ),
    bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `HalkBank - GAU = Alış : ${pHalkBankAlisGAU} TL / Satış: ${pHalkBankSatisGAU} TL`,
  )
}

export default function getHalkBankForex() {
  return (
    getHalkBankUSD() + getHalkBankEUR() + getHalkBankGAU() + getHalkBankEURUSD()
  )
}