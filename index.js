const TelegramBot = require('node-telegram-bot-api')
const env = require('dotenv').config().parsed
const bot = new TelegramBot(env.TOKEN, {polling: true})
const log = require('simple-node-logger').createRollingFileLogger({
	logDirectory: 'logs',
	fileNamePattern: '<date>.log',
	dateFormat: 'YYYY.MM.DD',
})
const data = require('./lib/data')
const phrases = data.phrases
const gameStrings = data.gameStrings
bot.on('message', message => {
	log.info('\n>> message:', message, '\n')
	function say(input) {
		if (typeof input === 'object') input = JSON.stringify(input)
		bot.sendMessage(message.chat.id, input, {parse_mode: 'Markdown'})
	}

	if (message.text === '/start' || message.text === '/help' || message.text === '/about') {
		say(phrases.hello + phrases.help)
	}
	else if (message.text.startsWith('/')) {
		say(phrases.unknownCommand)
	}
	else {
		if (message.forward_from && message.forward_from.id === data.ChatWarsBotID) {
			if (
				message.text.includes(gameStrings.equipment) ||
				message.text.includes(gameStrings.bag)
			) {
				const blocks = message.text.split('\n\n')
				if (message.text.includes(gameStrings.equipment)) {
					var equipment = blocks[0].split('\n').slice(1)
					equipment = equipment.map(line => {
						const match = line.match(data.itemsRegex)
						return {
							name: match[1],
							attack: match[5],
							defence: match[7],
							id: match[9],
						}
					})
					say(equipment)
				}
				if (message.text.includes(gameStrings.bag)) {
					var bag = blocks[1].split('\n').slice(1)
					bag = bag.map(line => {
						const match = line.match(data.itemsRegex)
						return {
							name: match[1],
							count: match[3],
							attack: match[5],
							defence: match[7],
							id: match[9],
						}
					})
					say(bag)
				}
			}
			else {
				say(phrases.brokenForward)
			}
		}
		else {
			say(phrases.unrecognizedInput + phrases.help)
		}
	}
})