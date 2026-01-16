from fastapi import FastAPI, Request
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
import os

# =============================
# الإعدادات
# =============================
BOT_TOKEN = "8283096353:AAEJhU6xnnZtlzake_gdUM0Zd24-5XepAxw"
APP_URL = "https://web-production-2f18d.up.railway.app"  # رابط الويب
BOT_NAME = "GgersCoin Bot"

bot = telebot.TeleBot(BOT_TOKEN, threaded=True)
app = FastAPI()

# =============================
# Telegram Webhook
# =============================
@app.post("/webhook")
async def telegram_webhook(req: Request):
    data = await req.json()
    update = telebot.types.Update.de_json(data)
    bot.process_new_updates([update])
    return {"ok": True}

# =============================
# رسالة /start + زر الويب
# =============================
@bot.message_handler(commands=["start"])
def start_handler(message):
    keyboard = InlineKeyboardMarkup()
    keyboard.add(
        InlineKeyboardButton(
            text="🚀 دخول اللعبة",
            web_app=WebAppInfo(url=APP_URL)
        )
    )

    bot.send_message(
        message.chat.id,
        f"""
👋 أهلاً بك في {BOT_NAME}

🎮 لعبة تفاعلية
⭐ تقدّم ومكافآت داخلية
🔐 تجربة آمنة داخل Telegram

👇 اضغط على الزر وابدأ
""",
        reply_markup=keyboard
    )

# =============================
# صفحة اختبار للويب
# =============================
@app.get("/")
def home():
    return {"status": "ok", "message": "Web app is running"}

# =============================
# Startup
# =============================
@app.on_event("startup")
async def on_startup():
    bot.delete_webhook(drop_pending_updates=True)
    bot.set_webhook(f"{APP_URL}/webhook")
    print("✅ Bot webhook set successfully")
