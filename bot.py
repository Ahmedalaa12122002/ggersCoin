import telebot

BOT_TOKEN = "8088771179:AAGvjDfgYc8LbwMhCyO1cgR-5zPdqYllhwE"
WEB_APP_URL = "https://ggerscoin-production.up.railway.app/"

bot = telebot.TeleBot(BOT_TOKEN)
bot.delete_webhook(drop_pending_updates=True)

@bot.message_handler(commands=["start"])
def start(message):
    kb = telebot.types.InlineKeyboardMarkup()
    kb.add(
        telebot.types.InlineKeyboardButton(
            "🚀 دخول التطبيق",
            web_app=telebot.types.WebAppInfo(url=WEB_APP_URL)
        )
    )

    bot.send_message(
        message.chat.id,
        "👋 أهلاً بك\n\nاضغط على الزر للدخول إلى التطبيق",
        reply_markup=kb
    )

print("BOT RUNNING")
bot.infinity_polling()
