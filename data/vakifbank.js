import axios from 'axios'
import cheerio from 'cheerio'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_vakifbank')
const setBankData = getDoc.update({
  bank_name: 'VakıfBank',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fvakif_logo.png?alt=media&token=fc1a89b3-1b7a-4242-bc0c-3642dd16e3de',
})

const getURL =
  'https://subesizbankacilik.vakifbank.com.tr/gunlukfinans/SubesizBankacilik/GunlukDovizKurlari.aspx'

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
    TegAction(767580569, 'Hey Profesör! Problem: VakıfBank')
  }
}

async function getVakifBankAlisUSD(html) {
  const $ = cheerio.load(html)
  const VakifBankAlisUSD = $(
    '#ctl00_plchldContent_dtaGridDovizKurlari > tbody > tr:nth-child(2) > td:nth-child(2)',
  ).text()
  return VakifBankAlisUSD
}

async function getVakifBankSatisUSD(html) {
  const $ = cheerio.load(html)
  const VakifBankSatisUSD = $(
    'table#ctl00_plchldContent_dtaGridDovizKurlari > tbody > tr:nth-child(2) > td:nth-child(3)',
  ).text()
  return VakifBankSatisUSD
}

export async function getVakifBankUSD() {
  const html = await getHTML(getURL)
  const pVakifBankAlisUSD = await getVakifBankAlisUSD(html)
  const pVakifBankSatisUSD = await getVakifBankSatisUSD(html)

  const setUSD = getDoc.update({
    bank_usd_buy: fixNumber(pVakifBankAlisUSD),
    bank_usd_sell: fixNumber(pVakifBankSatisUSD),
    bank_usd_rate: fixNumber(
      fixNumber(pVakifBankSatisUSD) - fixNumber(pVakifBankAlisUSD),
    ),
    bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `VakifBank - USD = Alış : ${pVakifBankAlisUSD} TL / Satış: ${pVakifBankSatisUSD} TL`,
  )
}

async function getVakifBankAlisEUR(html) {
  const $ = cheerio.load(html)
  const VakifBankAlisEUR = $(
    '#ctl00_plchldContent_dtaGridDovizKurlari > tbody > tr:nth-child(3) > td:nth-child(2)',
  ).text()
  return VakifBankAlisEUR
}

async function getVakifBankSatisEUR(html) {
  const $ = cheerio.load(html)
  const VakifBankSatisEUR = $(
    'table#ctl00_plchldContent_dtaGridDovizKurlari > tbody > tr:nth-child(3) > td:nth-child(3)',
  ).text()
  return VakifBankSatisEUR
}

export async function getVakifBankEUR() {
  const html = await getHTML(getURL)
  const pVakifBankAlisEUR = await getVakifBankAlisEUR(html)
  const pVakifBankSatisEUR = await getVakifBankSatisEUR(html)

  const setEUR = getDoc.update({
    bank_eur_buy: fixNumber(pVakifBankAlisEUR),
    bank_eur_sell: fixNumber(pVakifBankSatisEUR),
    bank_eur_rate: fixNumber(
      fixNumber(pVakifBankSatisEUR) - fixNumber(pVakifBankAlisEUR),
    ),
    bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `VakifBank - EUR = Alış : ${pVakifBankAlisEUR} TL / Satış: ${pVakifBankSatisEUR} TL`,
  )
}

export async function getVakifBankEURUSD() {
  const html = await getHTML(getURL)
  const pVakifBankAlisEUR = await getVakifBankAlisEUR(html)
  const pVakifBankSatisEUR = await getVakifBankSatisEUR(html)
  const pVakifBankAlisUSD = await getVakifBankAlisUSD(html)
  const pVakifBankSatisUSD = await getVakifBankSatisUSD(html)

  const setEURUSD = getDoc.update({
    bank_eurusd_buy: fixNumber(
      fixNumber(pVakifBankAlisEUR) / fixNumber(pVakifBankAlisUSD),
    ),
    bank_eurusd_sell: fixNumber(
      fixNumber(pVakifBankSatisEUR) / fixNumber(pVakifBankSatisUSD),
    ),
    bank_eurusd_rate: fixNumber(
      fixNumber(fixNumber(pVakifBankSatisEUR) / fixNumber(pVakifBankSatisUSD)) -
      fixNumber(fixNumber(pVakifBankAlisEUR) / fixNumber(pVakifBankAlisUSD)),
    ),
    bank_eurusd_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `VakifBank - EUR/USD = Alış : ${fixNumber(
      fixNumber(pVakifBankAlisEUR) / fixNumber(pVakifBankAlisUSD),
    )} $ / Satış: ${fixNumber(
      fixNumber(pVakifBankSatisEUR) / fixNumber(pVakifBankSatisUSD),
    )} $`,
  )
}

const getGAUURL =
  'https://subesizbankacilik.vakifbank.com.tr/gunlukfinans/SubesizBankacilik/AltinFiyatlari.aspx'

async function getGAUHTML(url) {
  try {
    const { data: html } = await axios({
      method: 'get',
      url: getGAUURL,
      timeout: 5000,
    })
    return html
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: VakıfBank - Altın')
  }
}

async function getVakifBankAlisGAU(html) {
  const $ = cheerio.load(html)
  const VakifBankAlisGAU = $(
    'table#ctl00_plchldContent_dtaGridAltin > tbody > tr:nth-child(3) > td:nth-child(3)',
  ).text()
  return VakifBankAlisGAU
}

async function getVakifBankSatisGAU(html) {
  const $ = cheerio.load(html)
  const VakifBankSatisGAU = $(
    'table#ctl00_plchldContent_dtaGridAltin > tbody > tr:nth-child(3) > td:nth-child(4)',
  ).text()
  return VakifBankSatisGAU
}

export async function getVakifBankGAU() {
  const html = await getGAUHTML(getURL)
  const pVakifBankAlisGAU = await getVakifBankAlisGAU(html)
  const pVakifBankSatisGAU = await getVakifBankSatisGAU(html)

  const setGAU = getDoc.update({
    bank_gau_buy: fixNumber(pVakifBankAlisGAU),
    bank_gau_sell: fixNumber(pVakifBankSatisGAU),
    bank_gau_rate: fixNumber(
      fixNumber(pVakifBankSatisGAU) - fixNumber(pVakifBankAlisGAU),
    ),
    bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `VakifBank - GAU = Alış : ${pVakifBankAlisGAU} TL / Satış: ${pVakifBankSatisGAU} TL`,
  )
}

export default function getVakifBankForex() {
  return (
    getVakifBankUSD() +
    getVakifBankEUR() +
    getVakifBankGAU() +
    getVakifBankEURUSD()
  )
}