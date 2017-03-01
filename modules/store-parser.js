import log from '../lib/log'
import fs from 'fs'
import data from './../lib/data'
const staticData = JSON.parse(fs.readFileSync('./lib/data.json', 'utf8'))
import speaker from './../lib/speaker'
const phrases = data.phrases
const gameStrings = data.gameStrings
export default (bot, message) => {
	const say = (input) => speaker(bot, message, input)
	const items = message.text.split('\n\n').slice(1).map(item => {
		const match = item.match(data.storeSellItemsRegex)
		return {
			name: match[1],
			storeSell: match[2],
			cost: match[2] * (10/3),
			id: match[3],
			input: match.input
		}
	})
	const store = staticData.store
	let storeItems = []
	store.forEach(obj => {
		Object.values(obj).forEach(type => {
			type.forEach(item => {
				storeItems.push(item)
			})
		})
	})
	let newItems = []
	items.forEach(item => {
		if (!storeItems.some(storeItem => storeItem.name === item.name)) {
			newItems.push(item)
		}
	})
	if (newItems.length > 0) {
		let phrase = `Благодарю за содействие! Эти предметы ещё у меня не записаны:\n`
		newItems.forEach(item => {
			phrase += `\n${item.name} 💰${item.storeSell} (${item.cost})`
		})
		phrase += `\n\nВ скором времени они будут добавлены в мои записи и я смогу их учитывать в общей стоимости твоих вещей.`
		log.info('>>> new items: ', newItems)
		say(phrase)
	}
	else {
		say('Благодарю за содействие, но все эти преметы мне уже известны.')
	}
}