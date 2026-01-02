import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

BOT_TOKEN = "8374900683:AAGBZ9Ni4jpsLDr0nemtPrJXL7U0nIZxskQ"
WEB_APP_URL = "https://ggerscoin-production.up.railway.app/"

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['start'])
def start(message):
    keyboard = InlineKeyboardMarkup()
    keyboard.add(
        InlineKeyboardButton(
            "🚀 دخول تطبيق GgersCoin",
            web_app={"url": WEB_APP_URL}
        )
    )

    bot.send_message(
        message.chat.id,
        "👋 مرحبًا بك في *GgersCoin*\n\n"
        "💰 نفّذ مهام، اجمع نقاط، وطوّر حسابك\n"
        "⭐ افتح مزايا VIP واربح أكثر\n\n"
        "⬇ اضغط الزر بالأسفل للدخول إلى التطبيق",
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

bot.infinity_polling()
