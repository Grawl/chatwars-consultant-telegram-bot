import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'
import basis from './modules/basis'
import forward from './modules/forward'
import inline from './modules/inline'
const env = dotenv.config().parsed
const bot = new TelegramBot(env.TOKEN, {polling: true})
basis(bot)
forward(bot)
inline(bot)
