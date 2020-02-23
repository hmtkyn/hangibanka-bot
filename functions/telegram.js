import Telegraf from 'telegraf'
import dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/./.env' })

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

export default function TegAction(TegMess = 'Test Hangibank') {
  const u_hmtkyn = 767580569
  bot.telegram.sendMessage(u_hmtkyn, TegMess)
}