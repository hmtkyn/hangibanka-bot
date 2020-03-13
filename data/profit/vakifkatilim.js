const TegAction = require('../../functions/telegram')
const db = require('../../functions/mysql')

const b_name = "Vakıf Katılım"
const b_slug = "vakifkatilim"
const b_url = "https://www.vakifkatilim.com.tr"
const b_logo = "https://hangibank.com/img/bank/vakifkatilim_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Katılım"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`


async function getVakifKatilim() {

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
        updateID: 'vakifkatilimTRY10000100003131',
        cType: 'TRY',
        priceStart: '10.000',
        priceEnd: '10.000',
        periodStart: '31',
        periodEnd: '31',
        profitShareRate: '8.39'
      },
      {
        updateID: 'vakifkatilimTRY10000100009191',
        cType: 'TRY',
        priceStart: '10.000',
        priceEnd: '10.000',
        periodStart: '91',
        periodEnd: '91',
        profitShareRate: '8.75'
      },
      {
        updateID: 'vakifkatilimTRY1000010000180180',
        cType: 'TRY',
        priceStart: '10.000',
        priceEnd: '10.000',
        periodStart: '180',
        periodEnd: '180',
        profitShareRate: '10.59'
      },
      {
        updateID: 'vakifkatilimTRY1000010000366366',
        cType: 'TRY',
        priceStart: '10.000',
        priceEnd: '10.000',
        periodStart: '366',
        periodEnd: '366',
        profitShareRate: '13.72'
      },
      {
        updateID: 'vakifkatilimTRY50000500003131',
        cType: 'TRY',
        priceStart: '50.000',
        priceEnd: '50.000',
        periodStart: '31',
        periodEnd: '31',
        profitShareRate: '8.39'
      },
      {
        updateID: 'vakifkatilimTRY50000500009191',
        cType: 'TRY',
        priceStart: '50.000',
        priceEnd: '50.000',
        periodStart: '91',
        periodEnd: '91',
        profitShareRate: '9.32'
      },
      {
        updateID: 'vakifkatilimTRY5000050000180180',
        cType: 'TRY',
        priceStart: '50.000',
        priceEnd: '50.000',
        periodStart: '180',
        periodEnd: '180',
        profitShareRate: '11.27'
      },
      {
        updateID: 'vakifkatilimTRY5000050000366366',
        cType: 'TRY',
        priceStart: '50.000',
        priceEnd: '50.000',
        periodStart: '366',
        periodEnd: '366',
        profitShareRate: '14.43'
      },
      {
        updateID: 'vakifkatilimTRY1000001000003131',
        cType: 'TRY',
        priceStart: '100.000',
        priceEnd: '100.000',
        periodStart: '31',
        periodEnd: '31',
        profitShareRate: '8.39'
      },
      {
        updateID: 'vakifkatilimTRY1000001000009191',
        cType: 'TRY',
        priceStart: '100.000',
        priceEnd: '100.000',
        periodStart: '91',
        periodEnd: '91',
        profitShareRate: '9.32'
      },
      {
        updateID: 'vakifkatilimTRY100000100000180180',
        cType: 'TRY',
        priceStart: '100.000',
        priceEnd: '100.000',
        periodStart: '180',
        periodEnd: '180',
        profitShareRate: '11.27'
      },
      {
        updateID: 'vakifkatilimTRY100000100000366366',
        cType: 'TRY',
        priceStart: '100.000',
        priceEnd: '100.000',
        periodStart: '366',
        periodEnd: '366',
        profitShareRate: '14.43'
      },
      {
        updateID: 'vakifkatilimTRY2500002500003131',
        cType: 'TRY',
        priceStart: '250.000',
        priceEnd: '250.000',
        periodStart: '31',
        periodEnd: '31',
        profitShareRate: '8.39'
      },
      {
        updateID: 'vakifkatilimTRY2500002500009191',
        cType: 'TRY',
        priceStart: '250.000',
        priceEnd: '250.000',
        periodStart: '91',
        periodEnd: '91',
        profitShareRate: '9.43'
      },
      {
        updateID: 'vakifkatilimTRY250000250000180180',
        cType: 'TRY',
        priceStart: '250.000',
        priceEnd: '250.000',
        periodStart: '180',
        periodEnd: '180',
        profitShareRate: '11.54'
      },
      {
        updateID: 'vakifkatilimTRY250000250000366366',
        cType: 'TRY',
        priceStart: '250.000',
        priceEnd: '250.000',
        periodStart: '366',
        periodEnd: '366',
        profitShareRate: '14.97'
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

module.exports = getVakifKatilim;