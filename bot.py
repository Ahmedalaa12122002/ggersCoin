# bot/bot.py

import telebot
from config import BOT_TOKEN
from start import start_message

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=["start"])
def handle_start(message):
    start_message(bot, message)

print("🤖 Bot is running...")
bot.infinity_polling()
