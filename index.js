const TelegramBot = require('node-telegram-bot-api')
const env = require('dotenv').config().parsed
const bot = new TelegramBot(env.TOKEN, {polling: true})
require('./modules/basis')(bot)
require('./modules/store')(bot)
require('./modules/inline')(bot)
