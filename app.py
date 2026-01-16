from fastapi import FastAPI
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
import threading
import time

# =============================
# الإعدادات
# =============================
BOT_TOKEN = "8283096353:AAEJhU6xnnZtlzake_gdUM0Zd24-5XepAxw"
WEB_APP_URL = "https://web-production-2f18d.up.railway.app"
BOT_NAME = "GgersCoin Bot"

bot = telebot.TeleBot(BOT_TOKEN)
app = FastAPI()

# =============================
# /start رسالة + زر
# =============================
@bot.message_handler(commands=["start"])
def start_handler(message):
    kb = InlineKeyboardMarkup()
    kb.add(
        InlineKeyboardButton(
            text="🚀 دخول التطبيق",
            web_app=WebAppInfo(url=WEB_APP_URL)
        )
    )

    bot.send_message(
        message.chat.id,
        f"""
👋 أهلاً بك في {BOT_NAME}

🎮 تجربة تفاعلية داخل Telegram  
⭐ تقدّم ومكافآت داخلية  
🔐 بيئة آمنة

👇 اضغط وابدأ
""",
        reply_markup=kb
    )

# =============================
# تشغيل البوت Polling
# =============================
def start_bot():
    while True:
        try:
            bot.infinity_polling(skip_pending=True)
        except Exception as e:
            print("Bot error:", e)
            time.sleep(5)

# =============================
# FastAPI
# =============================
@app.get("/")
def home():
    return {"status": "ok", "message": "Web app running"}

# =============================
# Startup
# =============================
@app.on_event("startup")
def startup_event():
    threading.Thread(target=start_bot, daemon=True).start()
    print("✅ Bot polling started")
