const axios = require('axios');
const cheerio = require('cheerio');
const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');

const b_name = "Denizbank"
const b_slug = "denizbank"
const b_url = "https://www.denizbank.com"
const b_logo = "https://hangibank.com/assets/img/bank/denizbank_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL = "https://www.denizbank.com/birikim-yonetimi/mevduat-urunleri/e-mevduat.aspx/LoadTable"

async function getDenizBank() {
  try {

    const response = await axios({
      method: 'post',
      url: getURL,
      timeout: 5000,
      data: { "currency": "TRY" },
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6,fr;q=0.5,zh-CN;q=0.4,zh;q=0.3,it;q=0.2",
        "Origin": "https://www.denizbank.com",
        "Accept": "text/plain, */*; q=0.01",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Referer": "https://www.denizbank.com/birikim-yonetimi/mevduat-urunleri/e-mevduat.aspx"
      }
    })

    const getdata = JSON.parse(JSON.stringify(response.data.d.Response));

    const $ = cheerio.load(getdata);

    const gettext = $('div>table.table > tbody >tr.tit2>th');

    let priceSet = [];

    for (let i = 1; i < gettext.length; i++) {
      priceSet.push($('div>table.table > tbody >tr.tit2>th:nth-child(' + (i + 1) + ')').text());
    }

    let allData = $('div > table.table > tbody > tr');

    let dataSet = [];

    for (let i = 0; i < priceSet.length; i++) {
      for (let k = 1; k < allData.length; k++) {
        dataSet.push({
          updateID: `${b_slug}TRY${priceSet[i].toString().replace(/\./g, '').split('-')[0].trim()}${priceSet[i].toString().replace(/\./g, '').split('-')[1].trim()}${$('div > table.table > tbody > tr:nth-child(' + (k + 1) + ') >td:nth-child(1)').text().split('-')[0]}${$('div > table.table > tbody > tr:nth-child(' + (k + 1) + ') > td:nth-child(1)').text().split('-')[1]}`,
          cType: 'TRY',
          priceStart: priceSet[i].toString().replace(/,/g, '.').split('-')[0].trim(),
          priceEnd: priceSet[i].toString().replace(/,/g, '.').split('-')[1].trim(),
          periodStart: $('div > table.table > tbody > tr:nth-child(' + (k + 1) + ') >td:nth-child(1)').text().split('-')[0],
          periodEnd: $('div > table.table > tbody > tr:nth-child(' + (k + 1) + ') > td:nth-child(1)').text().split('-')[1],
          interestRate: $('div > table.table > tbody > tr:nth-child(' + (k + 1) + ') >td:nth-child(' + (i + 2) + ')').text().toString().replace(/,/g, '.')
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

module.exports = getDenizBank;