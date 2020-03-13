const axios = require('axios')
const cheerio = require('cheerio')
const TegAction = require('../../functions/telegram')
const db = require('../../functions/mysql')

const b_name = "QNB Finansbank"
const b_slug = "qnbfinansbank"
const b_url = "https://www.qnbfinansbank.com"
const b_logo = "https://hangibank.com/img/bank/qnb_finans_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL = 'https://www.qnbfinansbank.com/e-vadeli-mevduat-urunleri'

async function getQNBFinansBank() {
  try {

    const response = await axios({
      url: getURL,
      method: 'get',
      timeout: 5000
    })
    const $ = cheerio.load(response.data);

    // Create Price Set Manuel
    const priceSet = []
    for (let i = 2; i <= 8; i++) {
      priceSet.push($('#ContentSection > section > div.container > div.page-subpage-container > div > div.col-md-9 > div > div:nth-child(3) > div > table:nth-child(2) > tbody > tr:nth-child(' + i + ') > td:nth-child(1) > strong').text().replace(/,/g, '.'))
    }
    console.log(priceSet)

    // Create Period Set Manuel
    const periodSet = [];
    for (let i = 2; i <= 7; i++) {
      periodSet.push($('#ContentSection > section > div.container > div.page-subpage-container > div > div.col-md-9 > div > div:nth-child(3) > div > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(' + i + ') > strong').text().replace(/[ gün]/g, ''))
    }
    console.log(periodSet)

    // Create Data
    let dataSet = []
    for (let price = 0; price < priceSet.length; price++) {
      for (let period = 0; period < periodSet.length; period++) {
        dataSet.push({
          updateID: `${b_slug}TRY${priceSet[price].split('-')[0].replace(/[ .]/g, '')}${priceSet[price].split('-')[1].replace(/[ .]/g, '')}${periodSet[period].split('-')[0]}${periodSet[period].split('-')[1]}`,
          cType: 'TRY',
          priceStart: priceSet[price].split('-')[0],
          priceEnd: priceSet[price].split('-')[1],
          periodStart: periodSet[period].split('-')[0],
          periodEnd: periodSet[period].split('-')[1],
          interestRate: $('#ContentSection > section > div.container > div.page-subpage-container > div > div.col-md-9 > div > div:nth-child(3) > div > table:nth-child(2) > tbody > tr:nth-child(' + (price + 2) + ') > td:nth-child(' + (period + 2) + ')').text().replace(/,/g, '.').replace(/%/g, '')
        })
      }
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

module.exports = getQNBFinansBank;