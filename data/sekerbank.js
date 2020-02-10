import axios from 'axios'
import cheerio from 'cheerio'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_sekerbank')
const setBankData = getDoc.update({
  bank_name: 'ŞekerBank',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fseker_logo.jpg?alt=media&token=8c17b812-4b4b-47aa-8b80-799e3d27fb49',
})

const getURL =
  'https://sube.sekerbank.com.tr/web/servlet/SekerbankServlet?service=SBkurlarOranlar.ButundovizKurlariListele&DISKURUM=ODC'

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
    TegAction(767580569, 'Hey Profesör! Problem: ŞekerBank')
  }
}

async function getSekerBankAlisUSD(html) {
  const $ = cheerio.load(html)
  const SekerBankAlisUSD = $(
    'body > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2)',
  ).html()
  return SekerBankAlisUSD
}

async function getSekerBankSatisUSD(html) {
  const $ = cheerio.load(html)
  const SekerBankSatisUSD = $(
    'body > div > div > table > tbody > tr:nth-child(2) > td:nth-child(3)',
  ).html()
  return SekerBankSatisUSD
}

export async function getSekerBankUSD() {
  const html = await getHTML(getURL)
  const pSekerBankAlisUSD = await getSekerBankAlisUSD(html)
  const pSekerBankSatisUSD = await getSekerBankSatisUSD(html)

  const setUSD = getDoc.update({
    bank_usd_buy: fixNumber(pSekerBankAlisUSD),
    bank_usd_sell: fixNumber(pSekerBankSatisUSD),
    bank_usd_rate: fixNumber(
      fixNumber(pSekerBankSatisUSD) - fixNumber(pSekerBankAlisUSD),
    ),
    bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `SekerBank - USD = Alış : ${pSekerBankAlisUSD} TL / Satış: ${pSekerBankSatisUSD} TL`,
  )
}

async function getSekerBankAlisEUR(html) {
  const $ = cheerio.load(html)
  const SekerBankAlisEUR = $(
    'body > div > div > table > tbody > tr:nth-child(3) > td:nth-child(2)',
  ).html()
  return SekerBankAlisEUR
}

async function getSekerBankSatisEUR(html) {
  const $ = cheerio.load(html)
  const SekerBankSatisEUR = $(
    'body > div > div > table > tbody > tr:nth-child(3) > td:nth-child(3)',
  ).html()
  return SekerBankSatisEUR
}

export async function getSekerBankEUR() {
  const html = await getHTML(getURL)
  const pSekerBankAlisEUR = await getSekerBankAlisEUR(html)
  const pSekerBankSatisEUR = await getSekerBankSatisEUR(html)

  const setEUR = getDoc.update({
    bank_eur_buy: fixNumber(pSekerBankAlisEUR),
    bank_eur_sell: fixNumber(pSekerBankSatisEUR),
    bank_eur_rate: fixNumber(
      fixNumber(pSekerBankSatisEUR) - fixNumber(pSekerBankAlisEUR),
    ),
    bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `SekerBank - EUR = Alış : ${pSekerBankAlisEUR} TL / Satış: ${pSekerBankSatisEUR} TL`,
  )
}

export async function getSekerBankEURUSD() {
  const html = await getHTML(getURL)
  const pSekerBankAlisEUR = await getSekerBankAlisEUR(html)
  const pSekerBankSatisEUR = await getSekerBankSatisEUR(html)
  const pSekerBankAlisUSD = await getSekerBankAlisUSD(html)
  const pSekerBankSatisUSD = await getSekerBankSatisUSD(html)

  const setEURUSD = getDoc.update({
    bank_eurusd_buy: fixNumber(
      fixNumber(pSekerBankAlisEUR) / fixNumber(pSekerBankAlisUSD),
    ),
    bank_eurusd_sell: fixNumber(
      fixNumber(pSekerBankSatisEUR) / fixNumber(pSekerBankSatisUSD),
    ),
    bank_eurusd_rate: fixNumber(
      fixNumber(fixNumber(pSekerBankSatisEUR) / fixNumber(pSekerBankSatisUSD)) -
      fixNumber(fixNumber(pSekerBankAlisEUR) / fixNumber(pSekerBankAlisUSD)),
    ),
    bank_eurusd_update: fire.firestore.Timestamp.fromDate(new Date()),
  })

  console.log(
    `SekerBank - EUR/USD = Alış : ${fixNumber(
      fixNumber(pSekerBankAlisEUR) / fixNumber(pSekerBankAlisUSD),
    )} $ / Satış: ${fixNumber(
      fixNumber(pSekerBankSatisEUR) / fixNumber(pSekerBankSatisUSD),
    )} $`,
  )
}

export default function getSekerBankForex() {
  return getSekerBankUSD() + getSekerBankEUR() + getSekerBankEURUSD()
}