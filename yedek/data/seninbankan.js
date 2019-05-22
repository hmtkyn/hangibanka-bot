import axios from 'axios'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_seninbankan')
const setBankData = getDoc.update({
  bank_name: 'SeninBankan',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fseninbankan_logo.jpg?alt=media&token=f1a74581-c445-4b6f-9a8f-dcdfc5868219',
})

// const getURL = 'https://basvuru.seninbankan.com.tr/ExchangeRate/GetExchangeRate'
const getURL = 'https://www.seninbankan.com.tr/Services/ForexService.aspx'
const fixDate = Date.now()

export async function getSeninBankanUSD() {
  try {
    const response = await axios({
      method: 'get',
      url: getURL,
      timeout: 5000,
      params: {
        _: fixDate,
      },
      headers: {
        'cache-control': 'no-cache',
        Referer: 'https://www.seninbankan.com.tr/piyasa-verileri.aspx',
        Connection: 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3,pt;q=0.2,de;q=0.1',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Pragma: 'no-cache',
      },
    })
    const resUSDBuy = response.data[0]['Value'].CurrencyBid
    const resUSDSell = response.data[0]['Value'].CurrencyAsk

    const setUSD = getDoc.update({
      bank_usd_buy: fixNumber(resUSDBuy),
      bank_usd_sell: fixNumber(resUSDSell),
      bank_usd_rate: fixNumber(fixNumber(resUSDSell) - fixNumber(resUSDBuy)),
      bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `SeninBankan - USD = Alış : ${resUSDBuy} TL / Satış: ${resUSDSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: SeninBankan -> Dolar')
  }
}

export async function getSeninBankanEUR() {
  try {
    const response = await axios({
      method: 'get',
      url: getURL,
      timeout: 5000,
      params: {
        _: fixDate,
      },
      headers: {
        'cache-control': 'no-cache',
        Referer: 'https://www.seninbankan.com.tr/piyasa-verileri.aspx',
        Connection: 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3,pt;q=0.2,de;q=0.1',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Pragma: 'no-cache',
      },
    })
    const resEURBuy = response.data[18]['Value'].CurrencyBid
    const resEURSell = response.data[18]['Value'].CurrencyAsk

    const setEUR = getDoc.update({
      bank_eur_buy: fixNumber(resEURBuy),
      bank_eur_sell: fixNumber(resEURSell),
      bank_eur_rate: fixNumber(fixNumber(resEURSell) - fixNumber(resEURBuy)),
      bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `SeninBankan - EUR = Alış : ${resEURBuy} TL / Satış: ${resEURSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: SeninBankan -> Euro')
  }
}

export async function getSeninBankanEURUSD() {
  try {
    const response = await axios({
      method: 'get',
      url: getURL,
      timeout: 5000,
      params: {
        _: fixDate,
      },
      headers: {
        'cache-control': 'no-cache',
        Referer: 'https://www.seninbankan.com.tr/piyasa-verileri.aspx',
        Connection: 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3,pt;q=0.2,de;q=0.1',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Pragma: 'no-cache',
      },
    })
    const resEURBuy = response.data[18]['Value'].CurrencyBid
    const resEURSell = response.data[18]['Value'].CurrencyAsk
    const resUSDBuy = response.data[0]['Value'].CurrencyBid
    const resUSDSell = response.data[0]['Value'].CurrencyAsk

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
      `SeninBankan - EUR/USD = Alış : ${resEURBuy} $ / Satış: ${resEURSell} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: SeninBankan -> Euro/Dolar')
  }
}

export async function getSeninBankanGAU() {
  try {
    const response = await axios({
      method: 'get',
      url: getURL,
      timeout: 5000,
      params: {
        _: fixDate,
      },
      headers: {
        'cache-control': 'no-cache',
        Referer: 'https://www.seninbankan.com.tr/piyasa-verileri.aspx',
        Connection: 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3,pt;q=0.2,de;q=0.1',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Pragma: 'no-cache',
      },
    })
    const resGAUBuy = response.data[30]['Value'].CurrencyBid
    const resGAUSell = response.data[30]['Value'].CurrencyAsk

    const setGAU = getDoc.update({
      bank_gau_buy: fixNumber(resGAUBuy),
      bank_gau_sell: fixNumber(resGAUSell),
      bank_gau_rate: fixNumber(fixNumber(resGAUSell) - fixNumber(resGAUBuy)),
      bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `SeninBankan - GAU = Alış : ${resGAUBuy} TL / Satış: ${resGAUSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: SeninBankan -> Altın')
  }
}

export default function getSeninBankanForex() {
  return (
    getSeninBankanUSD() +
    getSeninBankanEUR() +
    getSeninBankanGAU() +
    getSeninBankanEURUSD()
  )
}
