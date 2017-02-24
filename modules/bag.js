const fs = require('fs')
const data = require('./../lib/data')
const staticData = JSON.parse(fs.readFileSync('./lib/data.json', 'utf8'))
const speaker = require('./../lib/speaker')
const phrases = data.phrases
const gameStrings = data.gameStrings
module.exports = (bot, message) => {
	const say = (input) => speaker(bot, message, input)
	const blocks = message.text.split('\n\n')
	const store = staticData.store
	let storeItems = []
	store.forEach(obj => {
		Object.values(obj).forEach(type => {
			type.forEach(item => {
				storeItems.push(item)
			})
		})
	})
	let phrase = ''
	if (message.text.includes(gameStrings.equipment)) {
		var equipment = blocks[0].split('\n').slice(1)
		equipment = equipment.map(line => {
			const match = line.match(data.bagItemsRegex)
			return {
				name: match[1],
				attack: parseInt(match[5]),
				defence: parseInt(match[7]),
				id: parseInt(match[9]),
			}
		})
		// console.log(storeItems[4], equipment[0])
		// { id: 'sword5', name: 'Меч Рыцаря', cost: 1440, attack: 16 }
		// { name: 'Меч Рыцаря', attack: 16, defence: NaN, id: 105 }
	}
	if (message.text.includes(gameStrings.bag)) {
		var bag = blocks[1].split('\n').slice(1)
		bag = bag.map(line => {
			const match = line.match(data.bagItemsRegex)
			return {
				name: match[1],
				count: parseInt(match[3]),
				attack: parseInt(match[5]),
				defence: parseInt(match[7]),
				id: parseInt(match[9]),
			}
		})
	}
	let equipmentItemsToSell = []
	let bagItemsToSell = []
	storeItems.forEach(storeItem => {
		equipment.forEach((equipmentItem) => {
			if (equipmentItem.name === storeItem.name) equipmentItemsToSell.push(storeItem)
		})
		bag.forEach(bagItem => {
			if (bagItem.name === storeItem.name) bagItemsToSell.push(storeItem)
		})
	})
	let calc = {
		allCost: 0,
		'equipmentCost': 0,
		'equipmentItemsCostDescription': '',
		'equipmentItemsCostSumsDescription': '',
		'bagCost': 0,
		'bagItemsCostDescription': '',
		'bagItemsCostSumsDescription': '',
	}

	function itemsCalc(itemsToSell, itemsCost, itemsCostDescription, itemsCostSumsDescription) {
		let sums = []
		itemsToSell.forEach(item => {
			const itemSellCost = data.storeSell(item.cost)
			calc[itemsCost] += itemSellCost
			calc[itemsCostDescription] += `\n${item.name}: ${item.cost} × ${data.phrases.storeSellRatio} = ${itemSellCost}`
			sums.push(itemSellCost)
		})
		sums.forEach((sum, index, array) => {
			const plus = index + 1 < array.length ? ' + ' : ''
			calc[itemsCostSumsDescription] += sum + plus
		})
		calc.allCost += calc[itemsCost]
	}

	itemsCalc(
		equipmentItemsToSell,
		'equipmentCost',
		'equipmentItemsCostDescription',
		'equipmentItemsCostSumsDescription'
	)
	itemsCalc(
		bagItemsToSell,
		'bagCost',
		'bagItemsCostDescription',
		'bagItemsCostSumsDescription'
	)
	phrase += `🎽Экипировку можно продать за 💰${calc.equipmentCost}
${calc.equipmentItemsCostDescription}
⌨️ ${calc.equipmentItemsCostSumsDescription} = ${calc.equipmentCost}

`
	phrase += `🎒Содержимое рюкзака можно продать за 💰${calc.bagCost}
${calc.bagItemsCostDescription}
⌨️ ${calc.bagItemsCostSumsDescription} = ${calc.bagCost}
`
	phrase += `\nВсё вместе можно продать за 💰${calc.allCost}`
	say(phrase)
}