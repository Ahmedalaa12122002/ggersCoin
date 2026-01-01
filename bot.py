import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

BOT_TOKEN = "8374900683:AAGBZ9Ni4jpsLDr0nemtPrJXL7U0nIZxskQ"
WEB_APP_URL = "https://ggerscoin-production.up.railway.app/"

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=["start"])
def start(message):
    kb = InlineKeyboardMarkup()
    kb.add(
        InlineKeyboardButton(
            text="🚀 فتح تطبيق GgersCoin",
            web_app={"url": WEB_APP_URL}
        )
    )

    bot.send_message(
        message.chat.id,
        "أهلاً بك في **GgersCoin** 👋\n\n"
        "اضغط الزر بالأسفل لفتح التطبيق",
        reply_markup=kb,
        parse_mode="Markdown"
    )

bot.infinity_polling()
