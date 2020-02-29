const Telegraf = require('telegraf');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/./.env' })

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

function TegAction(TegMess = 'Test Hangibank') {
  const u_hmtkyn = 767580569
  bot.telegram.sendMessage(u_hmtkyn, TegMess)
}

module.exports = TegAction;