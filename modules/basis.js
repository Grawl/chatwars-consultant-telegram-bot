const log = require('../lib/log')
const data = require('./../lib/data')
const speaker = require('./../lib/speaker')
const phrases = data.phrases
module.exports = bot => {
	bot.on('message', message => {
		log.info('\n>> message:', message, '\n')
		const say = (input) => speaker(bot, message, input)
		if (message.forward_from && message.forward_from.id === data.ChatWarsBotID) return // store.js
		if (message.text === '/start' || message.text === '/help' || message.text === '/about') {
			say(phrases.hello + phrases.help)
		}
		else if (message.text.startsWith('/')) {
			say(phrases.unknownCommand)
		}
		else {
			say(phrases.unrecognizedInput + phrases.help)
		}
	})
}