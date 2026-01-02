import telebot
import os
import time

TOKEN = "8374900683:AAGBZ9Ni4jpsLDr0nemtPrJXL7U0nIZxskQ"

bot = telebot.TeleBot(TOKEN)

bot.remove_webhook()  # مهم جدًا لتجنب 409

@bot.message_handler(commands=['start'])
def start(message):
    bot.send_message(
        message.chat.id,
        "👋 أهلاً بك في GgersCoin\n\nاضغط الزر بالأسفل للدخول للتطبيق 👇",
        reply_markup=telebot.types.InlineKeyboardMarkup().add(
            telebot.types.InlineKeyboardButton(
                "🚀 فتح التطبيق",
                web_app=telebot.types.WebAppInfo(
                    url="https://ggerscoin-production.up.railway.app/"
                )
            )
        )
    )

print("=== BOT STARTED ===")

while True:
    try:
        bot.infinity_polling(timeout=10, long_polling_timeout=5)
    except Exception as e:
        print("Error:", e)
        time.sleep(5)
