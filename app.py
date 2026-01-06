import os
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import telebot

BOT_TOKEN = os.environ.get("8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ")
APP_URL = os.environ.get("https://ggerscoin-production.up.railway.app")  # https://xxxx.up.railway.app

bot = telebot.TeleBot(BOT_TOKEN)
app = FastAPI()

# ===== Telegram webhook =====
@app.post("/webhook")
async def telegram_webhook(req: Request):
    update = telebot.types.Update.de_json(await req.json())
    bot.process_new_updates([update])
    return {"ok": True}

@bot.message_handler(commands=["start"])
def start(message):
    kb = telebot.types.InlineKeyboardMarkup()
    kb.add(
        telebot.types.InlineKeyboardButton(
            "🚀 دخول التطبيق",
            web_app=telebot.types.WebAppInfo(url=APP_URL)
        )
    )
    bot.send_message(
        message.chat.id,
        "👋 أهلاً بك\nاضغط الزر للدخول إلى التطبيق",
        reply_markup=kb
    )

@app.on_event("startup")
async def on_startup():
    bot.remove_webhook()
    bot.set_webhook(url=f"{APP_URL}/webhook")

# ===== Web App =====
app.mount("/static", StaticFiles(directory="webapp"), name="static")

@app.get("/")
def home():
    return FileResponse("webapp/index.html")
