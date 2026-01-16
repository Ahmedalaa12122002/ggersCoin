from fastapi import FastAPI
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
import threading
import time

BOT_TOKEN = "8283096353:AAEJhU6xnnZtlzake_gdUM0Zd24-5XepAxw"
WEB_APP_URL = "https://web-production-2f18d.up.railway.app"

bot = telebot.TeleBot(BOT_TOKEN, threaded=False)
app = FastAPI()

@bot.message_handler(commands=["start"])
def start_handler(message):
    kb = InlineKeyboardMarkup()
    kb.add(
        InlineKeyboardButton(
            "🚀 دخول التطبيق",
            web_app=WebAppInfo(url=WEB_APP_URL)
        )
    )

    bot.send_message(
        message.chat.id,
        "👋 أهلاً بك\n\nاضغط الزر للدخول 👇",
        reply_markup=kb
    )

def run_bot():
    while True:
        try:
            print("Bot polling started")
            bot.polling(none_stop=True, interval=0)
        except Exception as e:
            print("Bot error:", e)
            time.sleep(5)

@app.on_event("startup")
def startup():
    threading.Thread(target=run_bot).start()

@app.get("/")
def root():
    return {"status": "ok"}
