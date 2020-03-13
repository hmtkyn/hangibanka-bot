const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');

async function archiveProfit() {
  try {

    let create_sql = `INSERT INTO archive_profit (bank_id,update_id,profit_currency_type,profit_price_start,profit_price_end,profit_period_start,profit_period_end,profit_share_rate) SELECT bank_id,update_id,profit_currency_type,profit_price_start,profit_price_end,profit_period_start,profit_period_end,profit_share_rate FROM realtime_profit ORDER BY bank_id ASC`

    db.query(create_sql, function (error) {
      if (error) throw error;
    })

    console.log('Archive Profit Share added!')
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: Archive Profit Share update failed.')
  }
}

module.exports = archiveProfit;