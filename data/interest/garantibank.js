const axios = require('axios')
const cheerio = require('cheerio')
const TegAction = require('../../functions/telegram')
const db = require('../../functions/mysql')

const b_name = "Garanti BBVA"
const b_slug = "garantibbva"
const b_url = "https://www.garantibbva.com.tr"
const b_logo = "https://hangibank.com/assets/img/bank/garanti_logo.jpg"
const b_type_capital = "Özel"
const b_type_service = "Mevduat"

let create_sql = `INSERT INTO bank_list (bank_name,bank_slug,bank_url,bank_logo,bank_type_capital,bank_type_service) VALUES ('${b_name}','${b_slug}','${b_url}','${b_logo}','${b_type_capital}','${b_type_service}')`

let update_sql = `UPDATE bank_list SET bank_name='${b_name}',bank_slug='${b_slug}',bank_url='${b_url}',bank_logo='${b_logo}',bank_type_capital='${b_type_capital}',bank_type_service='${b_type_service}' WHERE bank_name='${b_name}'`

const getURL =
  'https://www.garantibbva.com.tr/proxy/novaform/ratesandfees/e-time-deposit-rates-tr'

async function getGarantiBank() {
  try {
    const response = await axios({
      url: getURL,
      method: 'post',
      timeout: 5000,
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6,fr;q=0.5,zh-CN;q=0.4,zh;q=0.3,it;q=0.2",
        "Origin": "https://www.garantibbva.com.tr",
        "Accept": "application/json, text/javascript, */*",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Referer": "https://www.garantibbva.com.tr/tr/bireysel/mevduat_ve_yatirim/mevduat_urunleri/e_vadeli_hesap.page"
      }
    })

    const $ = cheerio.load(response.data.content);

    // Create Price Set Manuel
    const priceSet = []
    for (let i = 2; i <= 8; i++) {
      priceSet.push($('table.contentGrid>thead>tr:nth-child(1)>th:nth-child(' + i + ')>span>span>span').html().trim())
    }
    for (let i = 8; i <= 8; i++) {
      priceSet.push('1.000.000 - 999.999.999.999')
    }

    // Create Period Set Manuel
    const periodSet = [];
    for (let i = 1; i <= 5; i++) {
      periodSet.push($('table.contentGrid>tbody#content_first>tr:nth-child(' + i + ')>th:nth-child(1)').text().toString().replace(/[ ]/g, '').valueOf().replace(/\gün/g, ';').replace(/\ay/g, ';').split(';')[0])
    }
    for (let i = 7; i <= 11; i++) {
      periodSet.push($('table.contentGrid>tbody#content_first>tr:nth-child(' + i + ')>th:nth-child(1)').text().toString().replace(/[ ]/g, '').valueOf().replace(/\gün/g, ';').replace(/\ay/g, ';').split(';')[0])
    }
    for (let i = 13; i <= 18; i++) {
      periodSet.push($('table.contentGrid>tbody#content_first>tr:nth-child(' + i + ')>th:nth-child(1)').text().toString().replace(/[ ]/g, '').valueOf().replace(/\gün/g, ';').replace(/\ay/g, ';').split(';')[0])
    }
    for (let i = 20; i <= 24; i++) {
      periodSet.push($('table.contentGrid>tbody#content_first>tr:nth-child(' + i + ')>th:nth-child(1)').text().toString().replace(/[ ]/g, '').valueOf().replace(/\gün/g, ';').replace(/\ay/g, ';').split(';')[0])
    }
    for (let i = 25; i <= 25; i++) {
      periodSet.push('316-365')
    }

    // Create Data
    let dataSet = []

    for (let s = 0; s <= 4; s++) {
      for (let i = 0; i < priceSet.length; i++) {
        dataSet.push({
          updateID: `${b_slug}TRY${priceSet[i].replace(/[ .]/g, '').split('-')[0]}${priceSet[i].replace(/[ .]/g, '').split('-')[1]}${periodSet[s].replace(/[ ]/g, '').split('-')[0]}${periodSet[s].replace(/[ ]/g, '').split('-')[1]}`,
          cType: 'TRY',
          priceStart: priceSet[i].replace(/[ ]/g, '').split('-')[0],
          priceEnd: priceSet[i].replace(/[ ]/g, '').split('-')[1],
          periodStart: periodSet[s].replace(/[ ]/g, '').split('-')[0],
          periodEnd: periodSet[s].replace(/[ ]/g, '').split('-')[1],
          interestRate: $('table.contentGrid>tbody#content_first>tr:nth-child(' + (s + 1) + ')>td:nth-child(' + (i + 2) + ')').text().replace(/\,/g, '.').substring(0, 4)
        })
      }
    }
    for (let s = 5; s <= 9; s++) {
      for (let i = 0; i < priceSet.length; i++) {
        dataSet.push({
          updateID: `${b_slug}TRY${priceSet[i].replace(/[ .]/g, '').split('-')[0]}${priceSet[i].replace(/[ .]/g, '').split('-')[1]}${periodSet[s].replace(/[ ]/g, '').split('-')[0]}${periodSet[s].replace(/[ ]/g, '').split('-')[1]}`,
          cType: 'TRY',
          priceStart: priceSet[i].replace(/[ ]/g, '').split('-')[0],
          priceEnd: priceSet[i].replace(/[ ]/g, '').split('-')[1],
          periodStart: periodSet[s].replace(/[ ]/g, '').split('-')[0],
          periodEnd: periodSet[s].replace(/[ ]/g, '').split('-')[1],
          interestRate: $('table.contentGrid>tbody#content_first>tr:nth-child(' + (s + 2) + ')>td:nth-child(' + (i + 2) + ')').text().replace(/\,/g, '.').substring(0, 4)
        })
      }
    }
    for (let s = 10; s <= 15; s++) {
      for (let i = 0; i < priceSet.length; i++) {
        dataSet.push({
          updateID: `${b_slug}TRY${priceSet[i].replace(/[ .]/g, '').split('-')[0]}${priceSet[i].replace(/[ .]/g, '').split('-')[1]}${periodSet[s].replace(/[ ]/g, '').split('-')[0]}${periodSet[s].replace(/[ ]/g, '').split('-')[1]}`,
          cType: 'TRY',
          priceStart: priceSet[i].replace(/[ ]/g, '').split('-')[0],
          priceEnd: priceSet[i].replace(/[ ]/g, '').split('-')[1],
          periodStart: periodSet[s].replace(/[ ]/g, '').split('-')[0],
          periodEnd: periodSet[s].replace(/[ ]/g, '').split('-')[1],
          interestRate: $('table.contentGrid>tbody#content_first>tr:nth-child(' + (s + 3) + ')>td:nth-child(' + (i + 2) + ')').text().replace(/\,/g, '.').substring(0, 4)
        })
      }
    }
    for (let s = 16; s <= 21; s++) {
      for (let i = 0; i < priceSet.length; i++) {
        dataSet.push({
          updateID: `${b_slug}TRY${priceSet[i].replace(/[ .]/g, '').split('-')[0]}${priceSet[i].replace(/[ .]/g, '').split('-')[1]}${periodSet[s].replace(/[ ]/g, '').split('-')[0]}${periodSet[s].replace(/[ ]/g, '').split('-')[1]}`,
          cType: 'TRY',
          priceStart: priceSet[i].replace(/[ ]/g, '').split('-')[0],
          priceEnd: priceSet[i].replace(/[ ]/g, '').split('-')[1],
          periodStart: periodSet[s].replace(/[ ]/g, '').split('-')[0],
          periodEnd: periodSet[s].replace(/[ ]/g, '').split('-')[1],
          interestRate: $('table.contentGrid>tbody#content_first>tr:nth-child(' + (s + 4) + ')>td:nth-child(' + (i + 2) + ')').text().replace(/\,/g, '.').substring(0, 4)
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

module.exports = getGarantiBank;