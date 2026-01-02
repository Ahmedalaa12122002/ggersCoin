import telebot

BOT_TOKEN = "8374900683:AAGBZ9Ni4jpsLDr0nemtPrJXL7U0nIZxskQ"
WEB_APP_URL = "https://ggerscoin-production.up.railway.app/"

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=["start"])
def start(message):
    markup = telebot.types.InlineKeyboardMarkup()
    markup.add(
        telebot.types.InlineKeyboardButton(
            "🚀 دخول التطبيق",
            web_app=telebot.types.WebAppInfo(url=WEB_APP_URL)
        )
    )

    bot.send_message(
        message.chat.id,
        "👋 مرحبًا بك في *GgersCoin*\n\nاضغط على الزر للدخول إلى التطبيق 👇",
        reply_markup=markup,
        parse_mode="Markdown"
    )

print("=== BOT STARTED ===")
bot.infinity_polling()
