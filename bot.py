from telebot import TeleBot, types

BOT_TOKEN = "8374900683:AAGBZ9Ni4jpsLDr0nemtPrJXL7U0nIZxskQ"
WEBAPP_URL = "https://ggerscoin-production.up.railway.app/"

bot = TeleBot(BOT_TOKEN)

@bot.message_handler(commands=["start"])
def start(message):
    text = (
        "🎉 *مرحبًا بك في GgersCoin* \n\n"
        "💰 اكسب نقاط من المهام والألعاب\n"
        "⭐ نظام VIP بمميزات حصرية\n"
        "🔥 كل 10000 نقطة = 1 دولار\n\n"
        "اضغط الزر بالأسفل للدخول إلى التطبيق 👇"
    )

    kb = types.InlineKeyboardMarkup()
    kb.add(
        types.InlineKeyboardButton(
            "🚀 دخول تطبيق GgersCoin",
            web_app=types.WebAppInfo(WEBAPP_URL)
        )
    )

    bot.send_message(
        message.chat.id,
        text,
        reply_markup=kb,
        parse_mode="Markdown"
    )

bot.infinity_polling()
