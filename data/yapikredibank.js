import axios from 'axios'
import TegAction from '../functions/telegram'
import fire from '../functions/firestore'
import fixNumber from '../functions/numberfix'

const db = fire.firestore()

const getDoc = db.collection('fxt_bank').doc('fxt_yapikredibank')
const setBankData = getDoc.update({
  bank_name: 'Yapı Kredi',
  bank_img:
    'https://firebasestorage.googleapis.com/v0/b/forextakip-web.appspot.com/o/bank%2Fyapi_kredi_logo.jpg?alt=media&token=35c22eb2-97b6-4f69-b071-fa5e9e273255',
})

const getURL =
  'https://www.yapikredi.com.tr/_ajaxproxy/general.aspx/LoadMainCurrencies'

export async function getYapiKrediBankUSD() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'post',
      timeout: 5000,
      headers: {
        'cache-control': 'no-cache',
        Referer:
          'https://www.yapikredi.com.tr/yatirimci-kosesi/doviz-bilgileri',
        Connection: 'keep-alive',
        Cookie:
          '_ga=GA1.3.1277262414.1555785945; _gid=GA1.3.1441522397.1555785945; NSC_xxx.zbqjlsfej.dpn.us_ttm=14b5a3d999658a3d0eafc68099d3f6ebf657efefcc4f80142e0ff9a3655b058681cc0896; ASP.NET_SessionId=xluoaw2edfshbzmlazisk2n5; BehaviorPad_Profile=e8070350-70d8-43b2-8b2a-1c2e0dbb42d9; NSC_xxx.zbqjlsfej.dpn.us_xbg=5508a3d325e0f274457fe5eb7a63a957513b5ce79c6d7be139be7df345e0524263933b75; _gat=1; _fbp=fb.2.1555865718180.136676039; TDESessionID=13873575528454096; _sgf_user_id=72034382979497549; _sgf_session_id=956950636875063296; bp_visit_636914733168263209=p=~/yatirimci-kosesi/doviz-bilgileri&u=636914733423579493&h=2; TS01034ed8=014f1ea3699ff031fe0f3b6baf6481cb6c5fb7781113ceb6d828b8e743e1f55244f655bcc00a8ad73d37d101d3cd5d365acb6f3d647786b5abca37c88767b02f7891c1aa06f83734828d2753e1d551ce57baaf1ced275d0b65f6048fcac9da4079171fa903737cb2f4b6bab1370cf676e82ee5cb0b',
        'X-Requested-With': 'JQuery PageEvents',
        'Cache-Control': 'no-cache',
        Accept: 'text/plain, */*; q=0.01',
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Origin: 'https://www.yapikredi.com.tr',
        Pragma: 'no-cache',
      },
    })

    const resData = fixRes.data.d
    const resUSDBuy = resData[1]['buy']
    const resUSDSell = resData[1]['sell']

    const setUSD = getDoc.update({
      bank_usd_buy: fixNumber(resUSDBuy),
      bank_usd_sell: fixNumber(resUSDSell),
      bank_usd_rate: fixNumber(fixNumber(resUSDSell) - fixNumber(resUSDBuy)),
      bank_usd_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `YapiKrediBank - USD = Alış : ${resUSDBuy} TL / Satış: ${resUSDSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: Yapı Kredi Bankası -> Dolar')
  }
}

export async function getYapiKrediBankEUR() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'post',
      timeout: 5000,
      headers: {
        'cache-control': 'no-cache',
        Referer:
          'https://www.yapikredi.com.tr/yatirimci-kosesi/doviz-bilgileri',
        Connection: 'keep-alive',
        Cookie:
          '_ga=GA1.3.1277262414.1555785945; _gid=GA1.3.1441522397.1555785945; NSC_xxx.zbqjlsfej.dpn.us_ttm=14b5a3d999658a3d0eafc68099d3f6ebf657efefcc4f80142e0ff9a3655b058681cc0896; ASP.NET_SessionId=xluoaw2edfshbzmlazisk2n5; BehaviorPad_Profile=e8070350-70d8-43b2-8b2a-1c2e0dbb42d9; NSC_xxx.zbqjlsfej.dpn.us_xbg=5508a3d325e0f274457fe5eb7a63a957513b5ce79c6d7be139be7df345e0524263933b75; _gat=1; _fbp=fb.2.1555865718180.136676039; TDESessionID=13873575528454096; _sgf_user_id=72034382979497549; _sgf_session_id=956950636875063296; bp_visit_636914733168263209=p=~/yatirimci-kosesi/doviz-bilgileri&u=636914733423579493&h=2; TS01034ed8=014f1ea3699ff031fe0f3b6baf6481cb6c5fb7781113ceb6d828b8e743e1f55244f655bcc00a8ad73d37d101d3cd5d365acb6f3d647786b5abca37c88767b02f7891c1aa06f83734828d2753e1d551ce57baaf1ced275d0b65f6048fcac9da4079171fa903737cb2f4b6bab1370cf676e82ee5cb0b',
        'X-Requested-With': 'JQuery PageEvents',
        'Cache-Control': 'no-cache',
        Accept: 'text/plain, */*; q=0.01',
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Origin: 'https://www.yapikredi.com.tr',
        Pragma: 'no-cache',
      },
    })

    const resData = fixRes.data.d
    const resEURBuy = resData[0]['buy']
    const resEURSell = resData[0]['sell']

    const setEUR = getDoc.update({
      bank_eur_buy: fixNumber(resEURBuy),
      bank_eur_sell: fixNumber(resEURSell),
      bank_eur_rate: fixNumber(fixNumber(resEURSell) - fixNumber(resEURBuy)),
      bank_eur_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `YapiKrediBank - EUR = Alış : ${resEURBuy} TL / Satış: ${resEURSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: Yapı Kredi Bankası -> Euro')
  }
}

export async function getYapiKrediBankEURUSD() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'post',
      timeout: 5000,
      headers: {
        'cache-control': 'no-cache',
        Referer:
          'https://www.yapikredi.com.tr/yatirimci-kosesi/doviz-bilgileri',
        Connection: 'keep-alive',
        Cookie:
          '_ga=GA1.3.1277262414.1555785945; _gid=GA1.3.1441522397.1555785945; NSC_xxx.zbqjlsfej.dpn.us_ttm=14b5a3d999658a3d0eafc68099d3f6ebf657efefcc4f80142e0ff9a3655b058681cc0896; ASP.NET_SessionId=xluoaw2edfshbzmlazisk2n5; BehaviorPad_Profile=e8070350-70d8-43b2-8b2a-1c2e0dbb42d9; NSC_xxx.zbqjlsfej.dpn.us_xbg=5508a3d325e0f274457fe5eb7a63a957513b5ce79c6d7be139be7df345e0524263933b75; _gat=1; _fbp=fb.2.1555865718180.136676039; TDESessionID=13873575528454096; _sgf_user_id=72034382979497549; _sgf_session_id=956950636875063296; bp_visit_636914733168263209=p=~/yatirimci-kosesi/doviz-bilgileri&u=636914733423579493&h=2; TS01034ed8=014f1ea3699ff031fe0f3b6baf6481cb6c5fb7781113ceb6d828b8e743e1f55244f655bcc00a8ad73d37d101d3cd5d365acb6f3d647786b5abca37c88767b02f7891c1aa06f83734828d2753e1d551ce57baaf1ced275d0b65f6048fcac9da4079171fa903737cb2f4b6bab1370cf676e82ee5cb0b',
        'X-Requested-With': 'JQuery PageEvents',
        'Cache-Control': 'no-cache',
        Accept: 'text/plain, */*; q=0.01',
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Origin: 'https://www.yapikredi.com.tr',
        Pragma: 'no-cache',
      },
    })

    const resData = fixRes.data.d
    const resEURBuy = resData[0]['buy']
    const resEURSell = resData[0]['sell']
    const resUSDBuy = resData[1]['buy']
    const resUSDSell = resData[1]['sell']

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
      `YapiKrediBank - EUR/USD = Alış : ${fixNumber(
        fixNumber(resEURBuy) / fixNumber(resUSDBuy),
      )} $ / Satış: ${fixNumber(
        fixNumber(resEURSell) / fixNumber(resUSDSell),
      )} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction(
      767580569,
      'Hey Profesör! Problem: Yapı Kredi Bankası -> Euro/Dolar',
    )
  }
}

export async function getYapiKrediBankGAU() {
  try {
    const fixRes = await axios({
      url: getURL,
      method: 'post',
      timeout: 5000,
      headers: {
        'cache-control': 'no-cache',
        Referer:
          'https://www.yapikredi.com.tr/yatirimci-kosesi/doviz-bilgileri',
        Connection: 'keep-alive',
        Cookie:
          '_ga=GA1.3.1277262414.1555785945; _gid=GA1.3.1441522397.1555785945; NSC_xxx.zbqjlsfej.dpn.us_ttm=14b5a3d999658a3d0eafc68099d3f6ebf657efefcc4f80142e0ff9a3655b058681cc0896; ASP.NET_SessionId=xluoaw2edfshbzmlazisk2n5; BehaviorPad_Profile=e8070350-70d8-43b2-8b2a-1c2e0dbb42d9; NSC_xxx.zbqjlsfej.dpn.us_xbg=5508a3d325e0f274457fe5eb7a63a957513b5ce79c6d7be139be7df345e0524263933b75; _gat=1; _fbp=fb.2.1555865718180.136676039; TDESessionID=13873575528454096; _sgf_user_id=72034382979497549; _sgf_session_id=956950636875063296; bp_visit_636914733168263209=p=~/yatirimci-kosesi/doviz-bilgileri&u=636914733423579493&h=2; TS01034ed8=014f1ea3699ff031fe0f3b6baf6481cb6c5fb7781113ceb6d828b8e743e1f55244f655bcc00a8ad73d37d101d3cd5d365acb6f3d647786b5abca37c88767b02f7891c1aa06f83734828d2753e1d551ce57baaf1ced275d0b65f6048fcac9da4079171fa903737cb2f4b6bab1370cf676e82ee5cb0b',
        'X-Requested-With': 'JQuery PageEvents',
        'Cache-Control': 'no-cache',
        Accept: 'text/plain, */*; q=0.01',
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
        'Accept-Language':
          'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,it;q=0.6,es;q=0.5,ru;q=0.4,und;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'AlexaToolbar-ALX_NS_PH': 'AlexaToolbar/alx-4.0.3',
        Origin: 'https://www.yapikredi.com.tr',
        Pragma: 'no-cache',
      },
    })

    const resData = fixRes.data.d
    const resGAUBuy = resData[2]['buy']
    const resGAUSell = resData[2]['sell']

    const setGAU = getDoc.update({
      bank_gau_buy: fixNumber(resGAUBuy),
      bank_gau_sell: fixNumber(resGAUSell),
      bank_gau_rate: fixNumber(fixNumber(resGAUSell) - fixNumber(resGAUBuy)),
      bank_gau_update: fire.firestore.Timestamp.fromDate(new Date()),
    })

    console.log(
      `YapiKrediBank - GAU = Alış : ${resGAUBuy} TL / Satış: ${resGAUSell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction(767580569, 'Hey Profesör! Problem: Yapı Kredi Bankası -> Altın')
  }
}

export default function getYapiKrediBankForex() {
  return (
    getYapiKrediBankUSD() +
    getYapiKrediBankEUR() +
    getYapiKrediBankGAU() +
    getYapiKrediBankEURUSD()
  )
}