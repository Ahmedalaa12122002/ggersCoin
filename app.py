from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import telebot
import os

# =========================
# CONFIG
# =========================
BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
APP_URL = "https://web-production-1ba0e.up.railway.app"
BOT_NAME = "GgersCoin Bot"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEBAPP_DIR = os.path.join(BASE_DIR, "webapp")

# =========================
# APP & BOT
# =========================
app = FastAPI()
bot = telebot.TeleBot(BOT_TOKEN, threaded=False)

# =========================
# TELEGRAM /start
# =========================
@bot.message_handler(commands=["start"])
def start_handler(message):
    keyboard = telebot.types.InlineKeyboardMarkup()
    keyboard.add(
        telebot.types.InlineKeyboardButton(
            "🚀 ابدأ اللعب الآن",
            web_app=telebot.types.WebAppInfo(url=APP_URL)
        )
    )

    welcome_text = f"""
🌱 مرحبًا بك في {BOT_NAME}

🎮 العب واربح نقاط  
💰 كل ما تلعب أكتر تكسب أكتر  
🔥 ترقية VIP لربح أسرع  

👇 اضغط الزر وابدأ
"""

    bot.send_message(
        message.chat.id,
        welcome_text,
        reply_markup=keyboard
    )

# =========================
# WEBHOOK
# =========================
@app.post("/webhook")
async def telegram_webhook(request):
    data = await request.json()
    update = telebot.types.Update.de_json(data)
    bot.process_new_updates([update])
    return {"ok": True}

# =========================
# STATIC FILES
# =========================
app.mount("/static", StaticFiles(directory=WEBAPP_DIR), name="static")

# =========================
# FRONTEND
# =========================
@app.get("/")
def index():
    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))
