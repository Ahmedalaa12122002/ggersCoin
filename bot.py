import telebot
from telebot import types
import os

BOT_TOKEN = os.environ["8374900683:AAGBZ9Ni4jpsLDr0nemtPrJXL7U0nIZxskQ"]
WEB_APP_URL = os.environ["https://ggerscoin-production.up.railway.app/"]

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=["start"])
def start(msg):
    kb = types.InlineKeyboardMarkup()
    web = types.WebAppInfo(url=WEB_APP_URL)
    kb.add(types.InlineKeyboardButton("🚀 فتح التطبيق", web_app=web))
    bot.send_message(
        msg.chat.id,
        "مرحبًا بك في GgersCoin 👋\nاضغط لفتح التطبيق:",
        reply_markup=kb
    )

bot.infinity_polling()
