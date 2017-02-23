const log = require('../lib/log')
const data = require('./../lib/data')
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
	})
}