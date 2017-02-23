const log = require('../lib/log')
const fs = require('fs')
const staticData = JSON.parse(fs.readFileSync('./lib/data.json', 'utf8'))
const data = require('../lib/data')
module.exports = bot => {
	const store = staticData.store
	bot.on('inline_query', query => {
		log.info('\n>> inline query:', query, '\n')
		let results = []
		if (!isNaN(query.query)) {
			const sum = query.query
			let items = []
			store.forEach(obj => {
				Object.values(obj).forEach(type => {
					type.forEach(item => {
						if (sum >= item.cost) {
							items.push(item)
						}
					})
				})
			})
			items.sort((a, b) => {
				return b.cost - a.cost
			})
			results = items.map(item => {
				let title = ''
				if (item.attack && item.attack > 0) title += `+${item.attack}⚔`
				if (item.defence && item.defence > 0) title += `+${item.defence}🛡`
				return {
					type: 'article',
					id: item.id,
					title: `${item.cost}💰 ${item.name} ${title}`,
					description: `/buy_${item.id}`,
					message_text: `/buy_${item.id}`,
				}
			})
		}
		else results.push({
			type: 'article',
			id: 'NaN',
			title: data.phrases.inlineStoreSuggestionErrorTitle,
			description: data.phrases.inlineStoreSuggestionErrorDescription,
			message_text: data.phrases.inlineStoreSuggestionErrorSendMessage,
		})
		bot.answerInlineQuery(query.id, results)
	})
}