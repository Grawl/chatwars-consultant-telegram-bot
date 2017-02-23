const data = require('./../lib/data')
const speaker = require('./../lib/speaker')
const phrases = data.phrases
const gameStrings = data.gameStrings
module.exports = (bot, message) => {
	const say = (input) => speaker(bot, message, input)
	const blocks = message.text.split('\n\n')
	if (message.text.includes(gameStrings.equipment)) {
		var equipment = blocks[0].split('\n').slice(1)
		equipment = equipment.map(line => {
			const match = line.match(data.bagItemsRegex)
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
			const match = line.match(data.bagItemsRegex)
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