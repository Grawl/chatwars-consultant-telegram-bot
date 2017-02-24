# Telegram bot for [@ChatWarsBot](https://telegram.me/ChatWarsBot?start=be701fd8005249c2b39e9b79dc0edb66) game to help with 💰Gold

A game is only on Russian, so something will be only on russian, ok?

> **Привет!** Я помогу тебе с покупками в 🏚Лавке @ChatWarsBot

# Requirements

- Node.js
- Your own Telegram bot

# Launch

Install required Node libraries from NPM:

```
npm install
```

Open [Telegram Botfather](https://t.me/BotFather) and create a `/newbot`. You will receive HTTP API access token, looks like this:

```
361483634:AAFRwidokKmarw4cFxCiF65NTd8naqb1ngM
```

Copy `.env.example` file as `.env` and fill out all variables:

- Add your HTTP API access token as `TOKEN` field (used for connection)
- Bot unique username as `BOT_USERNAME` (used for localization)
- Icons in JPEG or PNG (used for inline results)

You should have something like this:

```
TOKEN=361483634:AAFRwidokKmarw4cFxCiF65NTd8naqb1ngM
BOT_USERNAME=name_of_my_bot
ICON_SWORD=http://url.to/image
ICON_SHIELD=http://url.to/image
```

Then, start bot server into a terminal into this repository root folder:

```
npm start
```

Done! Now you can send `/start` to your bot and read some russian responses for russian Telegram game.

# Development

It's easy as a pie, execute `npm run dev` and `nodemon` will restart app every time you change any sources.