const axios = require('axios')
const cheerio = require('cheerio')
const TegAction = require('../../functions/telegram')
const db = require('../../functions/mysql')

const b_name = "ŞekerBank"
const b_slug = "sekerbank"
const b_url = "https://www.sekerbank.com.tr"
const b_logo = "https://hangibank.com/assets/img/bank/seker_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL = 'https://sube.sekerbank.com.tr/web/servlet/SekerbankServlet?service=SBkurlarOranlar.MevduatFaizListeleInt&DISKURUM=ODC&paraBirimi=TL'

async function getSekerBank() {
  try {

    const response = await axios({
      url: getURL,
      method: 'get',
      timeout: 10000
    })
    const $ = cheerio.load(response.data);

    console.log($('#div_parabirimi_TL > table > tbody > tr:nth-child(1) > th:nth-child(2)').html())


    // Create Price Set Manuel
    const priceSet = []
    for (let i = 2; i <= 6; i++) {
      priceSet.push($('#div_parabirimi_TL > table > tbody > tr:nth-child(1) > th:nth-child(' + i + ')').text().replace(/[,]/g, '.').trim())
    }
    console.log(priceSet)

    // Create Period Set Manuel
    const periodSet = [];
    for (let i = 2; i <= 12; i++) {
      periodSet.push($('#div_parabirimi_TL > table > tbody > tr:nth-child(' + i + ') > td:nth-child(1)').html().replace(/[ G&#xFFFD;n]/g, '').trim())
    }
    for (let i = 13; i <= 13; i++) {
      periodSet.push('365-999')
    }
    console.log(periodSet)

    // Create Data
    let dataSet = []
    for (let price = 0; price < priceSet.length; price++) {
      for (let period = 0; period < periodSet.length; period++) {
        dataSet.push({
          updateID: `${b_slug}TRY${priceSet[price].split('-')[0].slice(0, -3).replace(/[ .]/g, '')}${priceSet[price].split('-')[1].slice(0, -3).replace(/[ .]/g, '')}${periodSet[period].split('-')[0]}${periodSet[period].split('-')[1]}`,
          cType: 'TRY',
          priceStart: priceSet[price].split('-')[0].slice(0, -4).trim(),
          priceEnd: priceSet[price].split('-')[1].slice(0, -3).trim(),
          periodStart: periodSet[period].split('-')[0].trim(),
          periodEnd: periodSet[period].split('-')[1].trim(),
          interestRate: $('#div_parabirimi_TL > table > tbody > tr:nth-child(' + (period + 2) + ') > td:nth-child(' + (price + 2) + ')').text()
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

module.exports = getSekerBank;
getSekerBank();