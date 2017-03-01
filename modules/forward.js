import log from '../lib/log'
import data from './../lib/data'
import bag from './bag'
import speaker from './../lib/speaker'
import storeParser from './store-parser'
const phrases = data.phrases
const gameStrings = data.gameStrings
export default bot => {
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
			else if (message.text.includes('Предметы на продажу')) {
				storeParser(bot, message)
			}
			else {
				say(phrases.brokenForward)
			}
		}
	})
}