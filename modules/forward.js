const log = require('../lib/log')
const data = require('./../lib/data')
const bag = require('./bag')
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
			else {
				say(phrases.brokenForward)
			}
		}
	})
}