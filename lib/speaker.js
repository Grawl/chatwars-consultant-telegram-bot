export default (bot, message, input) => {
	if (typeof input === 'object') input = JSON.stringify(input)
	bot.sendMessage(message.chat.id, input, {parse_mode: 'Markdown'})
}