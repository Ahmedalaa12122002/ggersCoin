import telebot
from telebot import types

TOKEN = "8374900683:AAGBZ9Ni4jpsLDr0nemtPrJXL7U0nIZxskQ"
WEB_APP_URL = "https://ggerscoin-production.up.railway.app/"

bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=["start"])
def start(message):
    markup = types.InlineKeyboardMarkup(row_width=1)

    open_app = types.InlineKeyboardButton(
        "🚀 دخول تطبيق GgersCoin",
        web_app=types.WebAppInfo(url=WEB_APP_URL)
    )

    markup.add(open_app)

    bot.send_message(
        message.chat.id,
        "🎉 مرحبًا بك في **GgersCoin**\n\n"
        "💰 اكسب نقاط\n"
        "📋 نفّذ مهام\n"
        "🔥 مكافآت يومية\n\n"
        "👇 اضغط الزر للدخول إلى التطبيق",
        reply_markup=markup,
        parse_mode="Markdown"
    )

bot.infinity_polling()
