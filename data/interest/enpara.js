const axios = require('axios');
const cheerio = require('cheerio');
const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');

const b_name = "EnPara"
const b_slug = "enpara"
const b_url = "https://www.qnbfinansbank.enpara.com"
const b_logo = "https://hangibank.com/img/bank/enpara_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

const getURL =
  'https://www.qnbfinansbank.enpara.com/hesaplar/vadeli-mevduat-hesabi'

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

async function getEnPara() {
  try {
    const html = await axios({
      method: 'get',
      url: getURL,
      timeout: 5000,
    })

    const $ = cheerio.load(html.data)

    const rate = $('section#birikim-hesaplayici>div.TRY>div.enpara-deposit-interest-rates__flex-table-item:nth-child(8)>div.enpara-deposit-interest-rates__flex-table-value').text()

    const priceSet = ['0 - 49.999', '50.000 - 149.999', '150.000 - 499.999', '500.000 - 999.999.999.999'];

    const periodSet = ['0 - 32', '33 - 46', '47 - 91', '91 - 181'];

    const rowHtml = [0, 6, 12, 18];

    const dataSet = [];

    for (let i = 0; i < priceSet.length; i++) {
      for (let s = 0; s < periodSet.length; s++) {
        dataSet.push({
          updateID: `${b_slug}TRY${priceSet[i].replace(/\./g, '').split('-')[0].trim()}${priceSet[i].replace(/\./g, '').split('-')[1].trim()}${periodSet[s].split('-')[0].trim()}${periodSet[s].split('-')[1].trim()}`,
          cType: 'TRY',
          priceStart: priceSet[i].split('-')[0].trim(),
          priceEnd: priceSet[i].split('-')[1].trim(),
          periodStart: periodSet[s].split('-')[0].trim(),
          periodEnd: periodSet[s].split('-')[1].trim(),
          interestRate: $('section#birikim-hesaplayici>div.TRY>div.enpara-deposit-interest-rates__flex-table-item:nth-child(' + (s + rowHtml[i] + 8) + ')>div.enpara-deposit-interest-rates__flex-table-value').text().trim().slice(1).replace(/\,/g, '.')
        })
      }
    }

    for (let data of dataSet) {

      let create_data = `INSERT INTO realtime_interest (bank_id,update_id,interest_currency_type,interest_price_start,interest_price_end,interest_period_start,interest_period_end,interest_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${data.updateID}','${data.cType}','${data.priceStart}','${data.priceEnd}','${data.periodStart}','${data.periodEnd}','${data.interestRate}') ON DUPLICATE KEY UPDATE update_id='${data.updateID}'`

      db.query(create_data, function (error) {
        if (error) throw error;
      })

    }

    console.log(dataSet.length)

  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: ' + b_name + ' -> Faiz Oranları')
  }
}

module.exports = getEnPara;