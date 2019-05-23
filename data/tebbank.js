import axios from 'axios'
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

const getGAUUrl = 'https://www.cepteteb.com.tr/webservice/index'

export async function getTEBBankGAU() {
  try {
    const fixRes = await axios({
      url: getGAUUrl,
      method: 'post',
      timeout: 5000,
      "data": "ServiceUrl=%2Fservices%2FGetGunlukAltinKur&Source=cepteteb&Data=",
      headers: {
        Host: 'www.cepteteb.com.tr',
        Referer: 'https://www.cepteteb.com.tr/altin-kurlari',
        Connection: 'keep-alive',
        Cookie: '_ga=GA1.3.1133586047.1555865199; _fbp=fb.2.1555865199131.902423697; cto_lwid=564d6151-49d8-4cc4-8290-54cf1a0eb456; _gid=GA1.3.1748148296.1558596817; popup=true; _gat=1',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3,pt;q=0.2,de;q=0.1',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Origin: 'https://www.cepteteb.com.tr',
        Pragma: 'no-cache'
      },
    })
    const resData = JSON.parse(fixRes.data)
    const resGAUBuy = resData['result'][0]['alisFiyat']
    const resGAUSell = resData['result'][0]['satisFiyat']

    const setGAU = getDoc.update({
      bank_gau_buy: fixNumber(resGAUBuy),
      bank_gau_sell: fixNumber(resGAUSell),
      bank_gau_rate: fixNumber(fixNumber(resGAUSell) - fixNumber(resGAUBuy)),
      bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `TEBBank - GAU = Alış : ${fixNumber(resGAUBuy)} TL / Satış: ${fixNumber(resGAUSell)} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: TEBBank -> Altın')
  }
}

export default function getTEBBankForex() {
  return (
    getTEBBankUSD() + getTEBBankEUR() + getTEBBankGAU() + getTEBBankEURUSD()
  )
}