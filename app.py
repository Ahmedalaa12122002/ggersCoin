from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import telebot
import os

# =========================
# CONFIG
# =========================
BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
APP_URL = "https://web-production-1ba0e.up.railway.app"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEBAPP_DIR = os.path.join(BASE_DIR, "webapp")

# =========================
# APP & BOT
# =========================
app = FastAPI()
bot = telebot.TeleBot(BOT_TOKEN, threaded=False)

# =========================
# STARTUP → WEBHOOK (مهم جدًا)
# =========================
@app.on_event("startup")
async def startup():
    bot.remove_webhook()
    bot.set_webhook(url=f"{APP_URL}/webhook")
    print("✅ Webhook connected")

# =========================
# TELEGRAM WEBHOOK
# =========================
@app.post("/webhook")
async def telegram_webhook(request: Request):
    json_data = await request.json()
    update = telebot.types.Update.de_json(json_data)
    bot.process_new_updates([update])
    return {"ok": True}

# =========================
# /start MESSAGE
# =========================
@bot.message_handler(commands=["start"])
def start(message):
    keyboard = telebot.types.InlineKeyboardMarkup()
    keyboard.add(
        telebot.types.InlineKeyboardButton(
            "🚀 ابدأ اللعب الآن",
            web_app=telebot.types.WebAppInfo(url=APP_URL)
        )
    )

    text = """
🌱 مرحبًا بك في GgersCoin 🌱

🎮 العب واربح نقاط  
💰 كل دقيقة لعب = مكسب  
🔥 فعّل VIP لمكافآت أكبر  

👇 اضغط الزر وابدأ
"""

    bot.send_message(
        message.chat.id,
        text,
        reply_markup=keyboard
    )

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
