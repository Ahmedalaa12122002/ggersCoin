import threading
import telebot
from flask import Flask, send_file
import os
import time

# ========= الإعدادات =========
BOT_TOKEN = "8374900683:AAGBZ9Ni4jpsLDr0nemtPrJXL7U0nIZxskQ"
WEB_URL = "https://ggerscoin-production.up.railway.app/"

bot = telebot.TeleBot(BOT_TOKEN)
app = Flask(__name__)

# ========= Flask (Web App) =========
@app.route("/")
def index():
    return send_file("index.html")

def run_flask():
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)

# ========= Telegram Bot =========
@bot.message_handler(commands=["start"])
def start(message):
    markup = telebot.types.InlineKeyboardMarkup()
    markup.add(
        telebot.types.InlineKeyboardButton(
            "🚀 دخول تطبيق GgersCoin",
            web_app=telebot.types.WebAppInfo(url=WEB_URL)
        )
    )

    bot.send_message(
        message.chat.id,
        "🎉 *مرحبًا بك في GgersCoin*\n\n"
        "💰 اكسب نقاط\n"
        "🎯 مهام يومية\n"
        "⭐ نظام VIP\n\n"
        "اضغط الزر بالأسفل للدخول 👇",
        reply_markup=markup,
        parse_mode="Markdown"
    )

def run_bot():
    while True:
        try:
            print("=== BOT STARTED ===")
            bot.infinity_polling(timeout=60, long_polling_timeout=60)
        except Exception as e:
            print("Bot error:", e)
            time.sleep(5)

# ========= تشغيل الاثنين معًا =========
if __name__ == "__main__":
    threading.Thread(target=run_flask).start()
    threading.Thread(target=run_bot).start()
