import axios from 'axios'
// import TegAction from '../../functions/telegram'
// import db from '../../functions/mysql'
// import fixNumber from '../../functions/numberfix'

const b_name = "Akbank"
const b_slug = "akbank"
const b_url = "https://www.akbank.com"
const b_logo = "https://hangibank.com/assets/img/bank/akbank_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL = "https://www.akbank.com/_vti_bin/AkbankServicesSecure/FrontEndServiceSecure.svc/GetDepositInterestData?_=1582898777905"

export async function getAkBankUSD() {
  try {

    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const singled = JSON.parse(response.data.GetDepositInterestDataResult).DepositInterests

    let newdata = [{
      "ID": 20886,
      "Title": "MEVDUAT",
      "FaizOran1": "6.75",
      "FaizOran2": "7.25",
      "FaizOran3": "7.5",
      "FaizOran4": "7.75",
      "FaizOran5": "8",
      "FaizOran6": "0",
      "FaizOran7": "0",
      "FaizOran8": "0",
      "FaizOran9": "0",
      "FaizOran10": "0",
      "MevduatDoviz": "TRY",
      "MiktarDizisi1": "0-9.999|10.000 - 49.999|50.000 - 99.999|100.000 - 499.999|500.000 - 999.999.999.999",
      "MiktarDizisi2": "",
      "MiktarDizisi3": "",
      "MiktarDizisi4": "",
      "MiktarDizisi5": "",
      "MevduatFaizTipi": "STANDART",
      "MevduatFaizTuru": "LISTE",
      "MevduatKanalKodu": "8",
      "MevduatPeriodTipi": "GUNLUK",
      "MevduatPeriodSatiri": "61 - 180",
      "MevduatKampanyaKalanGunSayisi": "0",
      "MevduatPeriodBaslangic": 61,
      "MevduatPeriodBitis": "180",
      "VadeSonu": "29.02.2020"
    }];

    let datas = [];
    for (const data of singled) {
      if (data.MevduatDoviz == 'TRY') {
        datas.push(data.MiktarDizisi)
      }
    }
    let datass = [...new Set(datas)].toString().split('|')
    // console.log(datass)

    for (const data of singled) {
      if (data.MevduatDoviz == 'TRY') {
        newdata.push(data)
      }
    }

    for (const item of newdata) {
      item.MiktarDizisi1 = datass[0],
        item.MiktarDizisi2 = datass[1],
        item.MiktarDizisi3 = datass[2],
        item.MiktarDizisi4 = datass[3],
        item.MiktarDizisi5 = datass[4]
    }
    console.log(newdata)

    // console.log(singled)
    // const resUSDBuy = resData['cur'][33]['DovizAlis']
    // const resUSDSell = resData['cur'][33]['DovizSatis']

    // let bank_usd_buy = fixNumber(resUSDBuy)
    // let bank_usd_sell = fixNumber(resUSDSell)
    // let bank_usd_rate = fixNumber(fixNumber(resUSDSell) - fixNumber(resUSDBuy))

    // let create_data = `INSERT INTO realtime_usd (bank_id,usd_buy,usd_sell,usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_usd_buy}','${bank_usd_sell}','${bank_usd_rate}')`

    // let update_data = `UPDATE realtime_usd SET usd_buy='${bank_usd_buy}',usd_sell='${bank_usd_sell}',usd_rate='${bank_usd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

    // db(update_data)

    // console.log('Realtime USD added!')
    // console.log(
    //   `AkBank - USD = Alış : ${bank_usd_buy} TL / Satış: ${bank_usd_sell} TL`,
    // )
  } catch (error) {
    console.error(error)
    // TegAction('Hey Profesör! Problem: AkBank -> Dolar')
  }

}

export async function getAkBankEUR() {
  try {

    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = JSON.parse(response.data.GetCurrencyRatesResult)
    const resEURBuy = resData['cur'][13]['DovizAlis']
    const resEURSell = resData['cur'][13]['DovizSatis']

    let bank_eur_buy = fixNumber(resEURBuy)
    let bank_eur_sell = fixNumber(resEURSell)
    let bank_eur_rate = fixNumber(fixNumber(resEURSell) - fixNumber(resEURBuy))

    let create_data = `INSERT INTO realtime_eur (bank_id,eur_buy,eur_sell,eur_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eur_buy}','${bank_eur_sell}','${bank_eur_rate}')`

    let update_data = `UPDATE realtime_eur SET eur_buy='${bank_eur_buy}',eur_sell='${bank_eur_sell}',eur_rate='${bank_eur_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

    db(update_data)

    console.log('Realtime EUR added!')
    console.log(
      `AkBank - EUR = Alış : ${bank_eur_buy} TL / Satış: ${bank_eur_sell} TL`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: AkBank -> Euro')
  }
}

export async function getAkBankEURUSD() {
  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = JSON.parse(response.data.GetCurrencyRatesResult)
    const resEURBuy = resData['cur'][13]['DovizAlis']
    const resEURSell = resData['cur'][13]['DovizSatis']
    const resUSDBuy = resData['cur'][33]['DovizAlis']
    const resUSDSell = resData['cur'][33]['DovizSatis']

    let bank_eurusd_buy = fixNumber(fixNumber(resEURBuy) / fixNumber(resUSDBuy))
    let bank_eurusd_sell = fixNumber(
      fixNumber(resEURSell) / fixNumber(resUSDSell),
    )
    let bank_eurusd_rate = fixNumber(
      fixNumber(fixNumber(resEURSell) / fixNumber(resUSDSell)) -
      fixNumber(fixNumber(resEURBuy) / fixNumber(resUSDBuy)),
    )

    let create_data = `INSERT INTO realtime_eur_usd (bank_id,eur_usd_buy,eur_usd_sell,eur_usd_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_eurusd_buy}','${bank_eurusd_sell}','${bank_eurusd_rate}')`

    let update_data = `UPDATE realtime_eur_usd SET eur_usd_buy='${bank_eurusd_buy}',eur_usd_sell='${bank_eurusd_sell}',eur_usd_rate='${bank_eurusd_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

    db(update_data)

    console.log('Realtime EUR/USD added!')
    console.log(
      `AkBank - EUR/USD = Alış : ${bank_eurusd_buy} $ / Satış: ${bank_eurusd_sell} $`,
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: AkBank -> Euro/Dolar')
  }
}

export async function getAkBankGAU() {

  try {
    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })
    const resData = JSON.parse(response.data.GetCurrencyRatesResult)
    const resGAUBuy = resData['cur'][35]['DovizAlis']
    const resGAUSell = resData['cur'][35]['DovizSatis']

    let bank_gau_buy = fixNumber(resGAUBuy)
    let bank_gau_sell = fixNumber(resGAUSell)
    let bank_gau_rate = fixNumber(fixNumber(resGAUSell) - fixNumber(resGAUBuy))

    let create_data = `INSERT INTO realtime_gau (bank_id,gau_buy,gau_sell,gau_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${bank_gau_buy}','${bank_gau_sell}','${bank_gau_rate}')`

    let update_data = `UPDATE realtime_gau SET gau_buy='${bank_gau_buy}',gau_sell='${bank_gau_sell}',gau_rate='${bank_gau_rate}' WHERE bank_id=(SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}')`

    db(update_data)

    console.log('Realtime GAU added!')
    console.log(
      `AkBank - GAU = Alış : ${bank_gau_buy} TL / Satış: ${bank_gau_sell} TL`
    )
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: AkBank -> GAU')
  }
}

export default function getAkbankForex() {
  return (getAkBankUSD())
}
getAkbankForex()