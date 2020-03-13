const TegAction = require('../../functions/telegram');
const db = require('../../functions/mysql');

async function archiveUSD() {
  try {

    let create_sql = `INSERT INTO archive_usd (bank_id,usd_buy,usd_sell,usd_rate) SELECT bank_id,usd_buy,usd_sell,usd_rate FROM realtime_usd ORDER BY bank_id ASC`

    db.query(create_sql, function (error) {
      if (error) throw error;
    })

    console.log('Archive USD added!')
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: Archive USD update failed.')
  }
}

async function archiveEUR() {
  try {

    let create_sql = `INSERT INTO archive_eur (bank_id,eur_buy,eur_sell,eur_rate) SELECT bank_id,eur_buy,eur_sell,eur_rate FROM realtime_eur ORDER BY bank_id ASC`

    db.query(create_sql, function (error) {
      if (error) throw error;
    })

    console.log('Archive EUR added!')
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: Archive EUR update failed.')
  }
}

async function archiveEURUSD() {
  try {

    let create_sql = `INSERT INTO archive_eur_usd (bank_id,eur_usd_buy,eur_usd_sell,eur_usd_rate) SELECT bank_id,eur_usd_buy,eur_usd_sell,eur_usd_rate FROM realtime_eur_usd ORDER BY bank_id ASC`

    db.query(create_sql, function (error) {
      if (error) throw error;
    })

    console.log('Archive EUR-USD added!')
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: Archive EUR-USD update failed.')
  }
}

async function archiveGAU() {
  try {

    let create_sql = `INSERT INTO archive_gau (bank_id,gau_buy,gau_sell,gau_rate) SELECT bank_id,gau_buy,gau_sell,gau_rate FROM realtime_gau ORDER BY bank_id ASC`

    db.query(create_sql, function (error) {
      if (error) throw error;
    })

    console.log('Archive GAU added!')
  } catch (error) {
    console.error(error)
    TegAction('Hey Profesör! Problem: Archive GAU update failed.')
  }
}

function archiveAll() {
  return (archiveUSD() + archiveEUR() + archiveEURUSD() + archiveGAU())
}

module.exports = archiveAll;