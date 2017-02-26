import fs from 'fs'
import data from './../lib/data'
const staticData = JSON.parse(fs.readFileSync('./lib/data.json', 'utf8'))
import speaker from './../lib/speaker'
const phrases = data.phrases
const gameStrings = data.gameStrings
export default (bot, message) => {
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
	if (message.text.includes(gameStrings.equipment)) {
		var equipment = blocks[0].split('\n').slice(1)
		equipment = equipment.map(line => {
			const match = line.match(data.bagItemsRegex)
			try {
				return {
					name: match[1].trim(),
					attack: parseInt(match[5]),
					defence: parseInt(match[7]),
					id: parseInt(match[9]),
				}
			}
			catch (error) {
				console.error(error)
			}
		})
	}
	if (message.text.includes(gameStrings.bag)) {
		var bag = blocks[1].split('\n').slice(1)
		bag = bag.map(line => {
			const match = line.match(data.bagItemsRegex)
			try {
				return {
					name: match[1],
					count: parseInt(match[3]),
					attack: parseInt(match[5]),
					defence: parseInt(match[7]),
					id: parseInt(match[9]),
				}
			}
			catch (error) {
				console.error(error)
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
			if (bagItem.name === storeItem.name) {
				const itemToAdd = Object.assign({
					count: bagItem.count
				}, storeItem)
				bagItemsToSell.push(itemToAdd)
			}
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
			const count = item.count ? item.count : 1
			const itemSellCost = data.storeSell(item.cost) * count
			calc[itemsCost] += itemSellCost
			const countString = item.count > 1 ? ` × ${item.count}` : ''
			calc[itemsCostDescription] += `\n${item.name}: ${item.cost} × ${data.phrases.storeSellRatio}${countString} = ${itemSellCost}`
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
	let phrase = ''
	phrase += data.phrases.sellEquipmentItems(calc.equipmentCost) + `
${calc.equipmentItemsCostDescription}
⌨️ ${calc.equipmentItemsCostSumsDescription} = ${calc.equipmentCost}

`
	phrase += data.phrases.sellBagItems(calc.bagCost) + `
${calc.bagItemsCostDescription}
⌨️ ${calc.bagItemsCostSumsDescription} = ${calc.bagCost}
`
	phrase += `\n` + data.phrases.sellAllItems(calc.allCost)
	say(phrase)
}