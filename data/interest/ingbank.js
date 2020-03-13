const axios = require('axios')
const cheerio = require('cheerio')
const TegAction = require('../../functions/telegram')
const db = require('../../functions/mysql')

const b_name = "ING Bank"
const b_slug = "ing"
const b_url = "https://www.ing.com.tr"
const b_logo = "https://hangibank.com/img/bank/ing_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL = 'https://www.ing.com.tr/tr/bilgi-destek/e-turuncu-faiz-oranlari'

async function getINGBank() {
  try {

    const response = await axios({
      url: getURL,
      method: 'get',
      timeout: 5000
    })
    const $ = cheerio.load(response.data);

    // Create Price Set Manuel
    const priceSet = []
    for (let i = 1; i <= 8; i++) {
      priceSet.push($('#page > section > div > div:nth-child(2) > table:nth-child(6) > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(1)').text().replace(/[ TL]/g, '').trim())
    }
    priceSet.push('1.000.0000 - 999.999.999.999')
    console.log(priceSet)

    // Create Period Set Manuel
    const periodSet = ['1-366', '367-999'];
    console.log(periodSet)


    // Create Data
    let dataSet = []
    for (let price = 0; price < priceSet.length; price++) {
      dataSet.push({
        updateID: `${b_slug}TRY${priceSet[price].replace(/[ TL.]/g, '').split('-')[0]}${priceSet[price].replace(/[ TL.]/g, '').split('-')[1]}${periodSet[0].split('-')[0]}${periodSet[0].split('-')[1]}`,
        cType: 'TRY',
        priceStart: priceSet[price].replace(/[ TL]/g, '').split('-')[0],
        priceEnd: priceSet[price].replace(/[ TL]/g, '').split('-')[1],
        periodStart: periodSet[0].split('-')[0],
        periodEnd: periodSet[0].split('-')[1],
        interestRate: $('#page > section > div > div:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(2)').text().replace(/[ %]/g, '').replace(/[,]/g, '.').trim()
      })
    }
    for (let price = 0; price < priceSet.length; price++) {
      dataSet.push({
        updateID: `${b_slug}TRY${priceSet[price].replace(/[ TL.]/g, '').split('-')[0]}${priceSet[price].replace(/[ TL.]/g, '').split('-')[1]}${periodSet[1].split('-')[0]}${periodSet[1].split('-')[1]}`,
        cType: 'TRY',
        priceStart: priceSet[price].replace(/[ TL]/g, '').split('-')[0],
        priceEnd: priceSet[price].replace(/[ TL]/g, '').split('-')[1],
        periodStart: periodSet[1].split('-')[0],
        periodEnd: periodSet[1].split('-')[1],
        interestRate: $('#page > section > div > div:nth-child(2) > table:nth-child(6) > tbody > tr:nth-child(' + (price + 2) + ') > td:nth-child(2)').text().replace(/[ %]/g, '').replace(/[,]/g, '.').trim()
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

module.exports = getINGBank;