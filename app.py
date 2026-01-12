from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import telebot
import os

BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
APP_URL   = "https://web-production-1ba0e.up.railway.app"
BOT_NAME  = "GgersCoin Bot"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEBAPP_DIR = os.path.join(BASE_DIR, "webapp")

# 🔴 مهم جدًا على Railway
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
# Telegram /start
# =============================
@bot.message_handler(commands=["start"])
def start_handler(message):
    kb = telebot.types.InlineKeyboardMarkup()
    kb.add(
        telebot.types.InlineKeyboardButton(
            "🚀 دخول التطبيق",
            web_app=telebot.types.WebAppInfo(url=APP_URL)
        )
    )

    bot.send_message(
        message.chat.id,
        f"""
👋 أهلاً بك في *{BOT_NAME}*

🎮 العب واربح نقاط  
💰 نظام مكافآت حقيقي  
🔥 فرص VIP ومميزات قوية  

👇 اضغط الزر وابدأ الآن
""",
        reply_markup=kb,
        parse_mode="Markdown"
    )

# =============================
# Startup (Webhook)
# =============================
@app.on_event("startup")
async def on_startup():
    bot.remove_webhook()
    bot.set_webhook(url=f"{APP_URL}/webhook")
    print("✅ Webhook is set and app is running")

# =============================
# Web App
# =============================
app.mount("/static", StaticFiles(directory=WEBAPP_DIR), name="static")

@app.get("/")
def home():
    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))
