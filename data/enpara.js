import axios from 'axios'
import cheerio from 'cheerio'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_enpara')
const setBankData = getDoc.update({
  bank_name: 'EnPara',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fenpara_logo.png?alt=media&token=1442ac90-18d9-485f-a7e1-18d7230ad760',
})

const getURL =
  'https://www.qnbfinansbank.enpara.com/doviz-kur-bilgileri/doviz-altin-kurlari.aspx'

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
    TegAction(767580569, 'Hey Profesör! Problem: EnPara')
  }
}

async function getEnParaAlisUSD(html) {
  const $ = cheerio.load(html)
  const EnParaAlisUSD = $(
    '#pnlContent > span:nth-child(1) > dl > dd:nth-child(2) > .dlCont > span',
  ).text()
  return EnParaAlisUSD
}

async function getEnParaSatisUSD(html) {
  const $ = cheerio.load(html)
  const EnParaSatisUSD = $(
    '#pnlContent > span:nth-child(1) > dl > dd:nth-child(3) > .dlCont > span',
  ).text()
  return EnParaSatisUSD
}

export async function getEnParaUSD() {
  const html = await getHTML(getURL)
  const pEnParaAlisUSD = await getEnParaAlisUSD(html)
  const pEnParaSatisUSD = await getEnParaSatisUSD(html)

  const setUSD = getDoc.update({
    bank_usd_buy: fixNumber(pEnParaAlisUSD),
    bank_usd_sell: fixNumber(pEnParaSatisUSD),
    bank_usd_rate: fixNumber(
      fixNumber(pEnParaSatisUSD) - fixNumber(pEnParaAlisUSD),
    ),
    bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `EnPara - USD = Alış : ${pEnParaAlisUSD} / Satış: ${pEnParaSatisUSD}`,
  )
}

async function getEnParaAlisEUR(html) {
  const $ = cheerio.load(html)
  const EnParaAlisEUR = $(
    '#pnlContent > span:nth-child(2) > dl > dd:nth-child(2) > .dlCont > span',
  ).text()
  return EnParaAlisEUR
}

async function getEnParaSatisEUR(html) {
  const $ = cheerio.load(html)
  const EnParaSatisEUR = $(
    '#pnlContent > span:nth-child(2) > dl > dd:nth-child(3) > .dlCont > span',
  ).text()
  return EnParaSatisEUR
}

export async function getEnParaEUR() {
  const html = await getHTML(getURL)
  const pEnParaAlisEUR = await getEnParaAlisEUR(html)
  const pEnParaSatisEUR = await getEnParaSatisEUR(html)

  const setEUR = getDoc.update({
    bank_eur_buy: fixNumber(pEnParaAlisEUR),
    bank_eur_sell: fixNumber(pEnParaSatisEUR),
    bank_eur_rate: fixNumber(
      fixNumber(pEnParaSatisEUR) - fixNumber(pEnParaAlisEUR),
    ),
    bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `EnPara - EUR = Alış : ${pEnParaAlisEUR} / Satış: ${pEnParaSatisEUR}`,
  )
}

export async function getEnParaEURUSD() {
  const html = await getHTML(getURL)
  const pEnParaAlisEUR = await getEnParaAlisEUR(html)
  const pEnParaSatisEUR = await getEnParaSatisEUR(html)
  const pEnParaAlisUSD = await getEnParaAlisUSD(html)
  const pEnParaSatisUSD = await getEnParaSatisUSD(html)

  const setEURUSD = getDoc.update({
    bank_eurusd_buy: fixNumber(
      fixNumber(pEnParaAlisEUR) / fixNumber(pEnParaAlisUSD),
    ),
    bank_eurusd_sell: fixNumber(
      fixNumber(pEnParaSatisEUR) / fixNumber(pEnParaSatisUSD),
    ),
    bank_eurusd_rate: fixNumber(
      fixNumber(fixNumber(pEnParaSatisEUR) / fixNumber(pEnParaSatisUSD)) -
      fixNumber(fixNumber(pEnParaAlisEUR) / fixNumber(pEnParaAlisUSD)),
    ),
    bank_eurusd_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `EnPara - EUR/USD = Alış : ${pEnParaAlisEUR} / Satış: ${pEnParaSatisEUR}`,
  )
}

async function getEnParaAlisGAU(html) {
  const $ = cheerio.load(html)
  const EnParaAlisGAU = $(
    '#pnlContent > span:nth-child(3) > dl > dd:nth-child(2) > .dlCont > span',
  ).text()
  return EnParaAlisGAU
}

async function getEnParaSatisGAU(html) {
  const $ = cheerio.load(html)
  const EnParaSatisGAU = $(
    '#pnlContent > span:nth-child(3) > dl > dd:nth-child(3) > .dlCont > span',
  ).text()
  return EnParaSatisGAU
}

export async function getEnParaGAU() {
  const html = await getHTML(getURL)
  const pEnParaAlisGAU = await getEnParaAlisGAU(html)
  const pEnParaSatisGAU = await getEnParaSatisGAU(html)

  const setGAU = getDoc.update({
    bank_gau_buy: fixNumber(pEnParaAlisGAU),
    bank_gau_sell: fixNumber(pEnParaSatisGAU),
    bank_gau_rate: fixNumber(
      fixNumber(pEnParaSatisGAU) - fixNumber(pEnParaAlisGAU),
    ),
    bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `EnPara - GAU = Alış : ${pEnParaAlisGAU} / Satış: ${pEnParaSatisGAU}`,
  )
}

export default function getEnParaForex() {
  return getEnParaUSD() + getEnParaEUR() + getEnParaGAU() + getEnParaEURUSD()
}
