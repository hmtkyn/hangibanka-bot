const axios = require('axios')
const TegAction = require('../../functions/telegram')
const db = require('../../functions/mysql')

const b_name = "İş Bank"
const b_slug = "isbank"
const b_url = "https://www.isbank.com.tr"
const b_logo = "https://hangibank.com/assets/img/bank/is_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`


const getURL = 'https://www.isbank.com.tr/_vti_bin/DV.Isbank/PriceAndRate/PriceAndRateService.svc/GetTermRates?MethodType=TL&Lang=tr&ProductType=UzunVadeli&ChannelType=ISCEP&_=' + Date.now() + ''

async function getIsBank() {
  try {

    const response = await axios({
      url: getURL,
      method: 'get',
      timeout: 5000,
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6,fr;q=0.5,zh-CN;q=0.4,zh;q=0.3,it;q=0.2",
        "Accept": "application/json, text/javascript, */*",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
      }
    })

    let data = response.data.Data

    // Create Data
    let dataSet = []
    for (let price = 1; price <= 78; price++) {
      dataSet.push({
        updateID: `${b_slug}TRY${data['' + price + ''].split('#')[0].replace(/,/g, '.').replace(/[.]/g, '')}${data['' + price + ''].split('#')[1].replace(/,/g, '.').replace(/-1.00/g, '999.999.999.999').replace(/[.]/g, '')}${data['' + price + ''].split('#')[2].replace(/[ ]/g, '')}${data['' + price + ''].split('#')[3].replace(/-1/g, '999')}`,
        cType: 'TRY',
        priceStart: data['' + price + ''].split('#')[0].replace(/,/g, '.'),
        priceEnd: data['' + price + ''].split('#')[1].replace(/,/g, '.').replace(/-1.00/g, '999.999.999.999'),
        periodStart: data['' + price + ''].split('#')[2].replace(/[ ]/g, ''),
        periodEnd: data['' + price + ''].split('#')[3].replace(/-1/g, '999'),
        interestRate: data['' + price + ''].split('#')[4].replace(/[ ,]/g, '.').slice(0, 4)
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

module.exports = getIsBank;