const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');

async function archiveInterest() {
  try {

    let create_sql = `INSERT INTO archive_interest (bank_id,update_id,interest_currency_type,interest_price_start,interest_price_end,interest_period_start,interest_period_end,interest_rate) SELECT bank_id,update_id,interest_currency_type,interest_price_start,interest_price_end,interest_period_start,interest_period_end,interest_rate FROM realtime_interest ORDER BY bank_id ASC`

    db.query(create_sql, function (error) {
      if (error) throw error;
    })

    console.log('Archive Interest added!')
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: Archive Interest update failed.')
  }
}

module.exports = archiveInterest;