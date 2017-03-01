import dotenv from 'dotenv'
const env = dotenv.config().parsed
export default {
	ChatWarsBotID: 265204902,
	gameStrings: {
		equipment: '🎽Экипировка',
		bag: '🎒Содержимое рюкзака',
		stock: '📦Склад с материалами',
		storeCategoryTitle: 'На прилавке ты видишь следующие товары'
	},
	// https://regex101.com/
	bagItemsRegex: /(\D+)\s*(\((\d+)\))?\s*(\+(\d+).+)?\s+(\+(\d+).+)?\s* \/(on|off)_(\d+)/,
	storeSellItemsRegex: /^(\D+)\s+\d+\s*x\s*(\d+).+\/sell_(\d+)/,
	storeSell: cost => Math.floor(cost * 0.3),
	phrases: {
		hello: `*Привет!* Я помогу тебе с покупками в 🏚Лавке @ChatWarsBot

`,
		help: `Сейчас я смогу помочь вот с чем:

*Посчитать, сколько стоит барахло в твоём 🎒Рюкзаке*
Для этого перешли мне сообщение, которое ты получишь по команде /bag в чате с @ChatWarsBot

*Подсказать, что из 🏚Лавки тебе по карману*
Для этого введи моё имя @${env.BOT_USERNAME} в любом чате и сообщи, сколько у тебя 💰Золота в кармане.

Исходники, обратная связь и всё прочее здесь: ${env.LINK_HOME}
И не стесняйтесь писать в личку @${env.FEEDBACK_USERNAME} по поводу бота`,
		unrecognizedInput: `Что-то я не понял, что ты пытаешься сделать.

Справка доступна по команде /about`,
		unknownCommand: `*Я такой команды не знаю*

Если ты ткнул команду бота @ChatWarsBot, то вот что: её нужно отправлять не мне.`,
		brokenForward: `Я вижу, что это сообщение от @ChatWarsBot, но *не вижу здесь твою 🎽Экипировку или 🎒Содержимое рюкзака*`,
		inlineStoreSuggestionErrorTitle: `Введите сумму 💰Золотых цифрами`,
		inlineStoreSuggestionErrorDescription: `Я пока не понимаю на словах`,
		inlineStoreSuggestionErrorSendMessage: `🏅Герой`,
		storeSellRatio: '30%',
		sellEquipmentItems: sum => `🎽Экипировку можно продать за 💰${sum}`,
		sellBagItems: sum => `🎒Содержимое рюкзака можно продать за 💰${sum}`,
		sellAllItems: sum => `Всё вместе можно продать за 💰${sum}`,
		parseError: `Не могу разобрать, что за предметы предо мной.`
	},
}