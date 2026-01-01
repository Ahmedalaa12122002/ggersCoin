import telebot
import os
from db import init_db, add_user

BOT_TOKEN = os.environ.get("8374900683:AAGBZ9Ni4jpsLDr0nemtPrJXL7U0nIZxskQ")

bot = telebot.TeleBot(https://ggerscoin-production.up.railway.app/)

init_db()

@bot.message_handler(commands=['start'])
def start(message):
    user_id = message.from_user.id
    username = message.from_user.username

    add_user(user_id, username)

    bot.send_message(
        message.chat.id,
        "👋 أهلاً بك في GgersCoin\n\nتم تسجيلك بنجاح ✅"
    )

print("Bot is running...")
bot.infinity_polling()
