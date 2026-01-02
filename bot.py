from telebot import TeleBot, types
import os

BOT_TOKEN = "8440388547:AAF8Ftiu7Qmi1GLfHzViIRAzgZE7khvvXC8"
WEB_APP_URL = "https://web-production-5622c.up.railway.app/"

bot = TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['start'])
def start(message):
    kb = types.InlineKeyboardMarkup()
    kb.add(
        types.InlineKeyboardButton(
            "🚀 دخول التطبيق",
            web_app=types.WebAppInfo(url=WEB_APP_URL)
        )
    )

    bot.send_message(
        message.chat.id,
        "👋 أهلاً بك في **GgersCoin**\n\nابدأ الآن واكسب النقاط 👇",
        reply_markup=kb,
        parse_mode="Markdown"
    )

bot.infinity_polling()
