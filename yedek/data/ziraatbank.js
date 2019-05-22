import axios from 'axios'
import cheerio from 'cheerio'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_ziraatbank')
const setBankData = getDoc.update({
  bank_name: 'ZiraatBank',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fziraat_logo.jpg?alt=media&token=85610ac9-1e5b-42d1-9f93-7652202a82cb',
})

const getURL = 'https://www.ziraatbank.com.tr/tr/fiyatlar-ve-oranlar'

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
    TegAction(767580569, 'Hey Profesör! Problem: Ziraat Bankası')
  }
}

async function getZiraatBankAlisUSD(html) {
  const $ = cheerio.load(html)
  const ZiraatBankAlisUSD = $(
    'div#result-dovizkur > .js-item:not(.hide) > div.table > table > tbody > tr:nth-child(1) > td:nth-child(3)',
  ).text()
  return ZiraatBankAlisUSD
}

async function getZiraatBankSatisUSD(html) {
  const $ = cheerio.load(html)
  const ZiraatBankSatisUSD = $(
    'div#result-dovizkur > .js-item:not(.hide) > div.table > table > tbody > tr:nth-child(1) > td:nth-child(4)',
  ).text()
  return ZiraatBankSatisUSD
}

export async function getZiraatBankUSD() {
  const html = await getHTML(getURL)
  const pZiraatBankAlisUSD = await getZiraatBankAlisUSD(html)
  const pZiraatBankSatisUSD = await getZiraatBankSatisUSD(html)

  const setUSD = getDoc.update({
    bank_usd_buy: fixNumber(pZiraatBankAlisUSD),
    bank_usd_sell: fixNumber(pZiraatBankSatisUSD),
    bank_usd_rate: fixNumber(
      fixNumber(pZiraatBankSatisUSD) - fixNumber(pZiraatBankAlisUSD),
    ),
    bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `ZiraatBank - USD = Alış : ${pZiraatBankAlisUSD} TL / Satış: ${pZiraatBankSatisUSD} TL`,
  )
}

async function getZiraatBankAlisEUR(html) {
  const $ = cheerio.load(html)
  const ZiraatBankAlisEUR = $(
    'div#result-dovizkur > .js-item:not(.hide) > div.table > table > tbody > tr:nth-child(2) > td:nth-child(3)',
  ).text()
  return ZiraatBankAlisEUR
}

async function getZiraatBankSatisEUR(html) {
  const $ = cheerio.load(html)
  const ZiraatBankSatisEUR = $(
    'div#result-dovizkur > .js-item:not(.hide) > div.table > table > tbody > tr:nth-child(2) > td:nth-child(4)',
  ).text()
  return ZiraatBankSatisEUR
}

export async function getZiraatBankEUR() {
  const html = await getHTML(getURL)
  const pZiraatBankAlisEUR = await getZiraatBankAlisEUR(html)
  const pZiraatBankSatisEUR = await getZiraatBankSatisEUR(html)

  const setEUR = getDoc.update({
    bank_eur_buy: fixNumber(pZiraatBankAlisEUR),
    bank_eur_sell: fixNumber(pZiraatBankSatisEUR),
    bank_eur_rate: fixNumber(
      fixNumber(pZiraatBankSatisEUR) - fixNumber(pZiraatBankAlisEUR),
    ),
    bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `ZiraatBank - EUR = Alış : ${pZiraatBankAlisEUR} TL / Satış: ${pZiraatBankSatisEUR} TL`,
  )
}

export async function getZiraatBankEURUSD() {
  const html = await getHTML(getURL)
  const pZiraatBankAlisEUR = await getZiraatBankAlisEUR(html)
  const pZiraatBankSatisEUR = await getZiraatBankSatisEUR(html)
  const pZiraatBankAlisUSD = await getZiraatBankAlisUSD(html)
  const pZiraatBankSatisUSD = await getZiraatBankSatisUSD(html)

  const setEURUSD = getDoc.update({
    bank_eurusd_buy: fixNumber(
      fixNumber(pZiraatBankAlisEUR) / fixNumber(pZiraatBankAlisUSD),
    ),
    bank_eurusd_sell: fixNumber(
      fixNumber(pZiraatBankSatisEUR) / fixNumber(pZiraatBankSatisUSD),
    ),
    bank_eurusd_rate: fixNumber(
      fixNumber(
        fixNumber(pZiraatBankSatisEUR) / fixNumber(pZiraatBankSatisUSD),
      ) -
      fixNumber(
        fixNumber(pZiraatBankAlisEUR) / fixNumber(pZiraatBankAlisUSD),
      ),
    ),
    bank_eurusd_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `ZiraatBank - EUR/USD = Alış : ${fixNumber(
      fixNumber(pZiraatBankAlisEUR) / fixNumber(pZiraatBankAlisUSD),
    )} $ / Satış: ${fixNumber(
      fixNumber(pZiraatBankSatisEUR) / fixNumber(pZiraatBankSatisUSD),
    )} $`,
  )
}

async function getZiraatBankAlisGAU(html) {
  const $ = cheerio.load(html)
  const ZiraatBankAlisGAU = $(
    'div#result-altinfiyat > .js-item:not(.hide) > div.table > table > tbody > tr:nth-child(2) > td:nth-child(3)',
  ).text()
  return ZiraatBankAlisGAU
}

async function getZiraatBankSatisGAU(html) {
  const $ = cheerio.load(html)
  const ZiraatBankSatisGAU = $(
    'div#result-altinfiyat > .js-item:not(.hide) > div.table > table > tbody > tr:nth-child(2) > td:nth-child(4)',
  ).text()
  return ZiraatBankSatisGAU
}

export async function getZiraatBankGAU() {
  const html = await getHTML(getURL)
  const pZiraatBankAlisGAU = await getZiraatBankAlisGAU(html)
  const pZiraatBankSatisGAU = await getZiraatBankSatisGAU(html)

  const setGAU = getDoc.update({
    bank_gau_buy: fixNumber(pZiraatBankAlisGAU),
    bank_gau_sell: fixNumber(pZiraatBankSatisGAU),
    bank_gau_rate: fixNumber(
      fixNumber(pZiraatBankSatisGAU) - fixNumber(pZiraatBankAlisGAU),
    ),
    bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `ZiraatBank - GAU = Alış : ${pZiraatBankAlisGAU} TL / Satış: ${pZiraatBankSatisGAU} TL`,
  )
}

export default function getZiraatBankForex() {
  return (
    getZiraatBankUSD() +
    getZiraatBankEUR() +
    getZiraatBankGAU() +
    getZiraatBankEURUSD()
  )
}
