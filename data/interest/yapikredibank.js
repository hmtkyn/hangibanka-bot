const axios = require('axios')
const cheerio = require('cheerio')
const TegAction = require('../../functions/telegram')
const db = require('../../functions/mysql')

const b_name = "Yapı Kredi"
const b_slug = "yapikredi"
const b_url = "https://www.yapikredi.com.tr"
const b_logo = "https://hangibank.com/assets/img/bank/yapi_kredi_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURLRate = 'https://www.yapikredi.com.tr/bireysel-bankacilik/hesaplama-araclari/e-mevduat-faizi-hesaplama.aspx/LoadDepositRatesData';

const getURLPrice = 'https://www.yapikredi.com.tr/bireysel-bankacilik/mevduat-urunleri/e-mevduat.aspx/LoadDepositLimitData'

async function getYapiKrediBank() {

  try {

    const responseRate = await axios({
      url: getURLRate,
      method: 'post',
      timeout: 10000,
      data: {}
    })
    const $1 = cheerio.load(responseRate.data.d.Data, { normalizeWhitespace: true, xmlMode: true, xml: true });

    // Create Period Set Manuel
    const periodSet = [];
    for (let i = 1; i <= 5; i++) {
      periodSet.push(`${$1('DepositRateData > RateTypes > RateItem[ID="ytl"] > Ranges > RangeItem:nth-child(' + i + ')').attr('MinDay')}-${$1('DepositRateData > RateTypes > RateItem[ID="ytl"] > Ranges > RangeItem:nth-child(' + i + ')').attr('MaxDay')}`)
    }
    console.log(periodSet)

    const responsePrice = await axios({
      url: getURLPrice,
      method: 'post',
      timeout: 10000,
      data: {}
    })
    const $2 = cheerio.load(responsePrice.data.d.Data, { normalizeWhitespace: true, xmlMode: true, xml: true });

    // Create Price Set Manuel
    const priceSet = []
    for (let i = 1; i <= 7; i++) {
      priceSet.push(`${$2('DepositLimitData > RateTypes > RateItem[ID="ytl"] > Ranges > RangeItem:nth-child(' + i + ')').attr('MinAmount').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.").slice(0, -3)}-${$2('DepositLimitData > RateTypes > RateItem[ID="ytl"] > Ranges > RangeItem:nth-child(' + i + ')').attr('MaxAmount').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.").slice(0, -3)}`)
    }
    console.log(priceSet)

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
          interestRate: $1('DepositRateData > RateTypes > RateItem[ID="ytl"] > Ranges > RangeItem:nth-child(' + (period + 1) + ')').attr('Ratio' + (price + 1) + '').replace(/,/g, '.')
        })
      }
    }
    console.log(dataSet)
    console.log(dataSet.length)

    for (let data of dataSet) {

      let create_data = `INSERT INTO realtime_interest(bank_id, update_id, interest_currency_type, interest_price_start, interest_price_end, interest_period_start, interest_period_end, interest_rate) VALUES((SELECT bank_id FROM bank_list WHERE bank_name = '${b_name}'), '${data.updateID}', '${data.cType}', '${data.priceStart}', '${data.priceEnd}', '${data.periodStart}', '${data.periodEnd}', '${data.interestRate}') ON DUPLICATE KEY UPDATE update_id = '${data.updateID}'`

      db.query(create_data, function (error) {
        if (error) throw error;
      })

    }

  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: ' + b_name + ' -> Faiz Oranları')
  }

}

module.exports = getYapiKrediBank;