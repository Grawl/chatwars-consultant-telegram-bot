const speaker = require('./../lib/speaker')
const data = require('../lib/data')
module.exports = (bot, message) => {
	const say = (input) => speaker(bot, message, input)
	say('о, категория Лавки')
	const items = message.text.split('\n\n').slice(1)
	// console.log('items', items)
	items.forEach(item => {
		let match = item.match(data.storeItemsRegex)
		// console.log(`>> item: "${item}"`)
		// console.log('>> match:')
		console.log(match)
		if(match !== null) {
			const object = {
				name: match[1],
				cost: match[2],
				attach: match[4],
				defence: match[6]
			}
			// say(object)
		}
	})
}