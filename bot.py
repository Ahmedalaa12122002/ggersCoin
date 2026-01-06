import telebot
import os
from start import start_message

BOT_TOKEN = os.getenv("8088771179:AAGvjDfgYc8LbwMhCyO1cgR-5zPdqYllhwE")

if not BOT_TOKEN:
    raise Exception("BOT_TOKEN is not set")

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=["start"])
def start_handler(message):
    start_message(bot, message)

print("🤖 Bot is running...")
bot.infinity_polling(skip_pending=True)
