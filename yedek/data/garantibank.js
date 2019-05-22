import axios from 'axios'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_garantibank')
const setBankData = getDoc.update({
  bank_name: 'Garanti',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fgaranti_logo.jpg?alt=media&token=2f49a722-4270-44f4-9bd0-dbb70ff23ac6',
})

const getURL =
  'https://www.garanti.com.tr/proxy/novaform/currency-list-and-detail'

const fixDate = Date.now()

export async function getGarantiBankUSD() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'get',
      timeout: 5000,
      params: {
        _: fixDate,
      },
      headers: {
        'cache-control': 'no-cache',
        Referer: 'https://www.garanti.com.tr/doviz-kurlari',
        Connection: 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Pragma: 'no-cache',
      },
    })

    const resData = JSON.parse(fixRes.data)
    const resUSDBuy = resData[0]['Exchange'][0]['buyRate']
    const resUSDSell = resData[0]['Exchange'][0]['sellRate']

    const setUSD = getDoc.update({
      bank_usd_buy: fixNumber(resUSDBuy),
      bank_usd_sell: fixNumber(resUSDSell),
      bank_usd_rate: fixNumber(fixNumber(resUSDSell) - fixNumber(resUSDBuy)),
      bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `GarantiBank - USD = Alış : ${resUSDBuy} TL / Satış: ${resUSDSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: GarantiBank -> Dolar')
  }
}

export async function getGarantiBankEUR() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'get',
      params: {
        _: fixDate,
      },
      headers: {
        'cache-control': 'no-cache',
        Referer: 'https://www.garanti.com.tr/doviz-kurlari',
        Connection: 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Pragma: 'no-cache',
      },
    })

    const resData = JSON.parse(fixRes.data)
    const resEURBuy = resData[0]['Exchange'][1]['buyRate']
    const resEURSell = resData[0]['Exchange'][1]['sellRate']

    const setEUR = getDoc.update({
      bank_eur_buy: fixNumber(resEURBuy),
      bank_eur_sell: fixNumber(resEURSell),
      bank_eur_rate: fixNumber(fixNumber(resEURSell) - fixNumber(resEURBuy)),
      bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `GarantiBank - EUR = Alış : ${resEURBuy} TL / Satış: ${resEURSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: GarantiBank -> Euro')
  }
}

export async function getGarantiBankEURUSD() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'get',
      params: {
        _: fixDate,
      },
      headers: {
        'cache-control': 'no-cache',
        Referer: 'https://www.garanti.com.tr/doviz-kurlari',
        Connection: 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Pragma: 'no-cache',
      },
    })

    const resData = JSON.parse(fixRes.data)
    const resEURBuy = resData[0]['Exchange'][1]['buyRate']
    const resEURSell = resData[0]['Exchange'][1]['sellRate']
    const resUSDBuy = resData[0]['Exchange'][0]['buyRate']
    const resUSDSell = resData[0]['Exchange'][0]['sellRate']

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
      `GarantiBank - EUR/USD = Alış : ${fixNumber(
        fixNumber(resEURBuy) / fixNumber(resUSDBuy),
      )} $ / Satış: ${fixNumber(
        fixNumber(resEURSell) / fixNumber(resUSDSell),
      )} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: GarantiBank -> Euro/Dolar')
  }
}

export async function getGarantiBankGAU() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'get',
      params: {
        _: fixDate,
      },
      headers: {
        'cache-control': 'no-cache',
        Referer: 'https://www.garanti.com.tr/doviz-kurlari',
        Connection: 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Pragma: 'no-cache',
      },
    })

    const resData = JSON.parse(fixRes.data)
    const resGAUBuy = resData[0]['Exchange'][2]['buyRate']
    const resGAUSell = resData[0]['Exchange'][2]['sellRate']

    const setGAU = getDoc.update({
      bank_gau_buy: fixNumber(resGAUBuy),
      bank_gau_sell: fixNumber(resGAUSell),
      bank_gau_rate: fixNumber(fixNumber(resGAUSell) - fixNumber(resGAUBuy)),
      bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `GarantiBank - GAU = Alış : ${resGAUBuy} TL / Satış: ${resGAUSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: GarantiBank -> Altın')
  }
}

export default function getGarantiBankForex() {
  return (
    getGarantiBankUSD() +
    getGarantiBankEUR() +
    getGarantiBankGAU() +
    getGarantiBankEURUSD()
  )
}
