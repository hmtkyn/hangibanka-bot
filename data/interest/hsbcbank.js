const axios = require('axios')
const https = require('https')
const TegAction = require('../../functions/telegram')
const db = require('../../functions/mysql')

const b_name = "HSBC Bank"
const b_slug = "hsbc"
const b_url = "https://www.hsbc.com.tr"
const b_logo = "https://hangibank.com/img/bank/hsbc_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL = 'https://www.hsbc.com.tr/api/InterestRate/getByType?type=1'

async function getHSBCBank() {
  try {

    const response = await axios({
      url: getURL,
      method: 'get',
      timeout: 5000,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      "headers": {
        "Connection": "keep-alive",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "Accept": "*/*",
        "X-Bone-Language": "BRYSL_TR",
        "Sec-Fetch-Dest": "empty",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Referer": "https://www.hsbc.com.tr/gunluk-bankacilik/mevduat-urunleri/faiz-oranlari",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6,fr;q=0.5,zh-CN;q=0.4,zh;q=0.3,it;q=0.2"
      }
    })
    console.log(JSON.parse(response.data.RawJson).GenericTable.Data.Rows.Row[0].Column[1].Value)

    // Create Price Set Manuel
    const priceSet = ['500', '250.000']
    console.log(priceSet)


    // Create Period Set Manuel
    const periodSet = [];
    for (let i = 0; i < 13; i++) {
      periodSet.push(JSON.parse(response.data.RawJson).GenericTable.Data.Rows.Row['' + i + ''].Column[0].Value)
    }
    console.log(periodSet)


    // Create Data
    let dataSet = []
    for (let period = 0; period < periodSet.length; period++) {
      dataSet.push({
        updateID: `${b_slug}TRY${priceSet[0].replace(/[.]/g, '')}${priceSet[1].replace(/[.]/g, '')}${periodSet[period].replace(/[ gün]/g, '').split('-')[0]}${periodSet[period].replace(/[ gün]/g, '').split('-')[1]}`,
        cType: 'TRY',
        priceStart: priceSet[0],
        priceEnd: priceSet[1],
        periodStart: periodSet[period].replace(/[ gün]/g, '').split('-')[0],
        periodEnd: periodSet[period].replace(/[ gün]/g, '').split('-')[1],
        interestRate: JSON.parse(response.data.RawJson).GenericTable.Data.Rows.Row['' + period + ''].Column[1].Value.replace(/[,]/g, '.')
      })
    }
    console.log(dataSet)
    console.log(dataSet.length)

    for (let data of dataSet) {

      let create_data = `INSERT INTO realtime_interest (bank_id,update_id,interest_currency_type,interest_price_start,interest_price_end,interest_period_start,interest_period_end,interest_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${data.updateID}','${data.cType}','${data.priceStart}','${data.priceEnd}','${data.periodStart}','${data.periodEnd}','${data.interestRate}') ON DUPLICATE KEY UPDATE update_id='${data.updateID}'`

      db.query(create_data, function (error) {
        if (error) throw error;
      })

    }

  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: ' + b_name + ' -> Faiz Oranları')
  }
}

module.exports = getHSBCBank;