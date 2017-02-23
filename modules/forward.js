const log = require('../lib/log')
const data = require('./../lib/data')
const bag = require('./bag')
const storeParser = require('./store-parser')
const speaker = require('./../lib/speaker')
const phrases = data.phrases
const gameStrings = data.gameStrings
module.exports = bot => {
	bot.on('message', message => {
		log.info('\n>> message:', message, '\n')
		const say = (input) => speaker(bot, message, input)
		if (message.forward_from && message.forward_from.id === data.ChatWarsBotID) {
			if (
				message.text.includes(gameStrings.equipment) ||
				message.text.includes(gameStrings.bag)
			) {
				bag(bot, message)
			}
			/*
			я затрахался ковырять чёртовы регэкспы!
			к тому же, у категории мечей нет заголовка.
			так что данные собираем ручками.
			else if(message.text.includes(data.gameStrings.storeCategoryTitle)) {
				storeParser(bot, message)
			}
			*/
			else {
				say(phrases.brokenForward)
			}
		}
	})
}