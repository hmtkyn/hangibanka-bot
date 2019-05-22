import Telegraf from 'telegraf'
import dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/./.env' })

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

export default function TegAction(TegId = 767580569, TegMess = 'Deneme Tel') {
  bot.telegram.sendMessage(TegId, TegMess)
}