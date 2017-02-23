const log = require('../lib/log')
module.exports = bot => {
	bot.on('inline_query', query => {
		console.log(query)
	})
}