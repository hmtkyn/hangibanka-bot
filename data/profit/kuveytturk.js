const TegAction = require('../../functions/telegram')
const db = require('../../functions/mysql')

const b_name = "Kuveyt Türk"
const b_slug = "kuveytturk"
const b_url = "https://www.kuveytturk.com.tr"
const b_logo = "https://hangibank.com/assets/img/bank/kuveyt_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Katılım"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`


async function getKuveytTurk() {

  try {

    // Create Period Set Manuel
    const periodSet = ['31', '91', '180', '366'];
    console.log(periodSet)

    // Create Price Set Manuel
    const priceSet = ['10.000', '50.000', '100.000', '250.000']
    console.log(priceSet)

    // Create Data
    let dataSet = [
      {
        updateID: 'kuveytturkTRY10000100003131',
        cType: 'TRY',
        priceStart: '10.000',
        priceEnd: '10.000',
        periodStart: '31',
        periodEnd: '31',
        profitShareRate: '7.13'
      },
      {
        updateID: 'kuveytturkTRY10000100009191',
        cType: 'TRY',
        priceStart: '10.000',
        priceEnd: '10.000',
        periodStart: '91',
        periodEnd: '91',
        profitShareRate: '8.16'
      },
      {
        updateID: 'kuveytturkTRY1000010000180180',
        cType: 'TRY',
        priceStart: '10.000',
        priceEnd: '10.000',
        periodStart: '180',
        periodEnd: '180',
        profitShareRate: '10.67'
      },
      {
        updateID: 'kuveytturkTRY1000010000366366',
        cType: 'TRY',
        priceStart: '10.000',
        priceEnd: '10.000',
        periodStart: '366',
        periodEnd: '366',
        profitShareRate: '14.65'
      },
      {
        updateID: 'kuveytturkTRY50000500003131',
        cType: 'TRY',
        priceStart: '50.000',
        priceEnd: '50.000',
        periodStart: '31',
        periodEnd: '31',
        profitShareRate: '7.34'
      },
      {
        updateID: 'kuveytturkTRY50000500009191',
        cType: 'TRY',
        priceStart: '50.000',
        priceEnd: '50.000',
        periodStart: '91',
        periodEnd: '91',
        profitShareRate: '8.62'
      },
      {
        updateID: 'kuveytturkTRY5000050000180180',
        cType: 'TRY',
        priceStart: '50.000',
        priceEnd: '50.000',
        periodStart: '180',
        periodEnd: '180',
        profitShareRate: '11.22'
      },
      {
        updateID: 'kuveytturkTRY5000050000366366',
        cType: 'TRY',
        priceStart: '50.000',
        priceEnd: '50.000',
        periodStart: '366',
        periodEnd: '366',
        profitShareRate: '15.19'
      },
      {
        updateID: 'kuveytturkTRY1000001000003131',
        cType: 'TRY',
        priceStart: '100.000',
        priceEnd: '100.000',
        periodStart: '31',
        periodEnd: '31',
        profitShareRate: '7.65'
      },
      {
        updateID: 'kuveytturkTRY1000001000009191',
        cType: 'TRY',
        priceStart: '100.000',
        priceEnd: '100.000',
        periodStart: '91',
        periodEnd: '91',
        profitShareRate: '9.07'
      },
      {
        updateID: 'kuveytturkTRY100000100000180180',
        cType: 'TRY',
        priceStart: '100.000',
        priceEnd: '100.000',
        periodStart: '180',
        periodEnd: '180',
        profitShareRate: '11.77'
      },
      {
        updateID: 'kuveytturkTRY100000100000366366',
        cType: 'TRY',
        priceStart: '100.000',
        priceEnd: '100.000',
        periodStart: '366',
        periodEnd: '366',
        profitShareRate: '16.10'
      },
      {
        updateID: 'kuveytturkTRY2500002500003131',
        cType: 'TRY',
        priceStart: '250.000',
        priceEnd: '250.000',
        periodStart: '31',
        periodEnd: '31',
        profitShareRate: '7.65'
      },
      {
        updateID: 'kuveytturkTRY2500002500009191',
        cType: 'TRY',
        priceStart: '250.000',
        priceEnd: '250.000',
        periodStart: '91',
        periodEnd: '91',
        profitShareRate: '9.07'
      },
      {
        updateID: 'kuveytturkTRY250000250000180180',
        cType: 'TRY',
        priceStart: '250.000',
        priceEnd: '250.000',
        periodStart: '180',
        periodEnd: '180',
        profitShareRate: '11.77'
      },
      {
        updateID: 'kuveytturkTRY250000250000366366',
        cType: 'TRY',
        priceStart: '250.000',
        priceEnd: '250.000',
        periodStart: '366',
        periodEnd: '366',
        profitShareRate: '16.10'
      }
    ]
    console.log(dataSet)
    console.log(dataSet.length)

    for (let data of dataSet) {

      let create_data = `INSERT INTO realtime_profit (bank_id, update_id, profit_currency_type, profit_price_start, profit_price_end, profit_period_start, profit_period_end, profit_share_rate) VALUES((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'), '${data.updateID}', '${data.cType}', '${data.priceStart}', '${data.priceEnd}', '${data.periodStart}', '${data.periodEnd}', '${data.profitShareRate}') ON DUPLICATE KEY UPDATE update_id = '${data.updateID}'`

      db.query(create_data, function (error) {
        if (error) throw error;
      })

    }

  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: ' + b_name + ' -> Kar Payı Oranları')
  }

}

module.exports = getKuveytTurk;