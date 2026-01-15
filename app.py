import threading
import os
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import telebot

# ======================
# الإعدادات
# ======================
BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
APP_URL = "https://web-production-2f18d.up.railway.app"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEBAPP_DIR = os.path.join(BASE_DIR, "webapp")

bot = telebot.TeleBot(BOT_TOKEN)
app = FastAPI()

# ======================
# رسالة /start + زر الويب
# ======================
@bot.message_handler(commands=["start"])
def start_handler(message):
    keyboard = telebot.types.InlineKeyboardMarkup()
    keyboard.add(
        telebot.types.InlineKeyboardButton(
            text="🚀 دخول التطبيق",
            web_app=telebot.types.WebAppInfo(url=APP_URL)
        )
    )

    bot.send_message(
        message.chat.id,
        "👋 أهلاً بك\n\n"
        "🎮 لعبة ويب تفاعلية\n"
        "👇 اضغط الزر للدخول",
        reply_markup=keyboard
    )

# ======================
# تشغيل البوت (Polling)
# ======================
def run_bot():
    bot.infinity_polling(skip_pending=True)

# ======================
# Web App
# ======================
app.mount("/static", StaticFiles(directory=WEBAPP_DIR), name="static")

@app.get("/")
def home():
    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))

# ======================
# تشغيل الكل
# ======================
if __name__ == "__main__":
    threading.Thread(target=run_bot).start()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
