const axios = require('axios');
const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');

const b_name = "Akbank"
const b_slug = "akbank"
const b_url = "https://www.akbank.com"
const b_logo = "https://hangibank.com/img/bank/akbank_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

let getDate = Date.now();
const getURL = "https://www.akbank.com/_vti_bin/AkbankServicesSecure/FrontEndServiceSecure.svc/GetDepositInterestData?_=" + getDate + ""

async function getAkBank() {
  try {

    const response = await axios({ method: 'get', url: getURL, timeout: 5000 })

    const getData = JSON.parse(response.data.GetDepositInterestDataResult).DepositInterests

    let dataSet = [];

    let priceSet = [];

    for (let data of getData) {
      if (data.MevduatDoviz == 'TRY') {
        dataSet.push(data);
        priceSet.push(data.MiktarDizisi);
      }
    }

    let fixPriceSet = [...new Set(priceSet)].toString().split('|');

    let fixDataSet = [];

    for (let data of dataSet) {

      for (let i = 0; i < fixPriceSet.length; i++) {

        fixDataSet.push({
          updateID: b_slug + data.MevduatDoviz.toString() + fixPriceSet[i].toString().replace(/,/g, '').split(" - ")[0] + fixPriceSet[i].toString().replace(/,/g, '').split(" - ")[1] + data.MevduatPeriodBaslangic.toString() + data.MevduatPeriodBitis.toString(),
          cType: data.MevduatDoviz.toString(),
          priceStart: fixPriceSet[i].toString().replace(/,/g, '.').split(" - ")[0],
          priceEnd: fixPriceSet[i].toString().replace(/,/g, '.').split(" - ")[1],
          periodStart: data.MevduatPeriodBaslangic.toString(),
          periodEnd: data.MevduatPeriodBitis.toString(),
          interestRate: data['FaizOran' + [i + 1] + ''].toString()
        })

      }

    }

    for (let data of fixDataSet) {

      let create_data = `INSERT INTO realtime_interest (bank_id,update_id,interest_currency_type,interest_price_start,interest_price_end,interest_period_start,interest_period_end,interest_rate) VALUES ((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'),'${data.updateID}','${data.cType}','${data.priceStart}','${data.priceEnd}','${data.periodStart}','${data.periodEnd}','${data.interestRate}') ON DUPLICATE KEY UPDATE update_id='${data.updateID}'`

      db.query(create_data, function (error) {
        if (error) throw error;
      })

    }

    console.log(fixDataSet.length);

  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: ' + b_name + ' -> Faiz Oranları')
  }

}

module.exports = getAkBank;