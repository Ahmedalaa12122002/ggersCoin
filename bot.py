import telebot
from telebot import types
import os

BOT_TOKEN = os.environ["8374900683:AAGBZ9Ni4jpsLDr0nemtPrJXL7U0nIZxskQ"]
WEB_APP_URL = os.environ["https://ggerscoin-production.up.railway.app/"]

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=["start"])
def start(message):
    keyboard = types.InlineKeyboardMarkup()
    
    web_app = types.WebAppInfo(url=WEB_APP_URL)
    
    button = types.InlineKeyboardButton(
        text="🚀 فتح التطبيق",
        web_app=web_app
    )
    
    keyboard.add(button)

    bot.send_message(
        message.chat.id,
        "اضغط الزر لفتح التطبيق 👇",
        reply_markup=keyboard
    )

bot.infinity_polling()
