import fs from 'fs'
import dotenv from 'dotenv'
import log from '../lib/log'
import speaker from './../lib/speaker'
import data from './../lib/data'
const env = dotenv.config().parsed
const staticData = JSON.parse(fs.readFileSync('./lib/data.json', 'utf8'))
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
			if(match) {
				return {
					name: match[1].trim(),
					attack: parseInt(match[5]),
					defence: parseInt(match[7]),
					id: parseInt(match[9]),
				}
			}
			else {
				return {
					name: line
				}
			}
		})
	}
	if (message.text.includes(gameStrings.bag)) {
		var bag = blocks[1].split('\n').slice(1)
		bag = bag.map(line => {
			const match = line.match(data.bagItemsRegex)
			if(match) {
				return {
					name: match[1],
					count: parseInt(match[3]),
					attack: parseInt(match[5]),
					defence: parseInt(match[7]),
					id: parseInt(match[9]),
				}
			}
			else {
				return {
					name: line
				}
			}
		})
	}
	let unknownEquipmentItems = []
	let unknownBagItems = []
	unknownItems()
	function unknownItems() {
		equipment.forEach(item => {
			if (!storeItems.some(storeItem => storeItem.name === item.name)) {
				unknownEquipmentItems.push(item)
			}
		})
		bag.forEach(item => {
			if (!storeItems.some(storeItem => storeItem.name === item.name)) {
				unknownBagItems.push(item)
			}
		})
	}

	let allUnknownItems = unknownEquipmentItems.concat(unknownBagItems)
	if (allUnknownItems.length > 0) {
		log.info('>> new items: ', allUnknownItems)
	}
	let equipmentItemsToSell = []
	let bagItemsToSell = []
	itemsToSell()
	function itemsToSell() {
		storeItems.forEach(storeItem => {
			equipment.forEach((equipmentItem) => {
				if (equipmentItem.name === storeItem.name) {
					equipmentItemsToSell.push(storeItem)
				}
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
	}

	let calc = {
		allCost: 0,
		'equipmentCost': 0,
		'equipmentItemsCostDescription': '',
		'equipmentItemsCostSumsDescription': '',
		'bagCost': 0,
		'bagItemsCostDescription': '',
		'bagItemsCostSumsDescription': '',
	}
	itemsCalc(
		equipmentItemsToSell,
		unknownEquipmentItems,
		'equipmentCost',
		'equipmentItemsCostDescription',
		'equipmentItemsCostSumsDescription'
	)
	itemsCalc(
		bagItemsToSell,
		unknownBagItems,
		'bagCost',
		'bagItemsCostDescription',
		'bagItemsCostSumsDescription'
	)
	function itemsCalc(itemsToSell, unknownItems, itemsCost, itemsCostDescription, itemsCostSumsDescription) {
		let sums = []
		itemsToSell.forEach(item => {
			const count = item.count ? item.count : 1
			const itemSellCost = data.storeSell(item.cost) * count
			calc[itemsCost] += itemSellCost
			const countString = item.count > 1 ? ` × ${item.count}` : ''
			calc[itemsCostDescription] += `\n${item.name}: ${item.cost} × ${data.phrases.storeSellRatio}${countString} = ${itemSellCost}`
			sums.push(itemSellCost)
		})
		unknownItems.forEach(item => {
			calc[itemsCostDescription] += `\n${item.name}: ???`
			sums.push('???')
		})
		sums.forEach((sum, index, array) => {
			const plus = index + 1 < array.length ? ' + ' : ''
			calc[itemsCostSumsDescription] += sum + plus
		})
		calc.allCost += calc[itemsCost]
	}

	function phraseUnknownCount(array) {
		let phrase = ' + ???'
		let string = ''
		for (let i = 0; i < array.length; i++) {
			string += phrase
		}
		return array.length > 0 ? string : ''
	}

	function calcEqualSymbol(array) {
		return array.length > 0 ? ' ≈ ' : ' = '
	}

	let phrase = ''
	phrase += data.phrases.sellEquipmentItems(calc.equipmentCost)
		+ phraseUnknownCount(unknownEquipmentItems)
		+ `
${calc.equipmentItemsCostDescription}
⌨️ ${calc.equipmentItemsCostSumsDescription}` + calcEqualSymbol(unknownEquipmentItems) + `${calc.equipmentCost}

`
	phrase += data.phrases.sellBagItems(calc.bagCost)
		+ phraseUnknownCount(unknownBagItems)
		+ `
${calc.bagItemsCostDescription}
⌨️ ${calc.bagItemsCostSumsDescription}` + calcEqualSymbol(unknownBagItems) + `${calc.bagCost}
`
	phrase += `\n` + data.phrases.sellAllItems(calc.allCost) + phraseUnknownCount(allUnknownItems)
	if (allUnknownItems.length > 0) phrase += data.phrases.unknownItemsTip
	say(phrase)
}