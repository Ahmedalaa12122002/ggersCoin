import os
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import telebot

BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
WEBHOOK_URL = "https://ggerscoin-production.up.railway.app/webhook"

bot = telebot.TeleBot(BOT_TOKEN)
app = FastAPI()

# Webhook route for Telegram
@app.post("/webhook")
async def telegram_webhook(req: Request):
    data = await req.json()
    update = telebot.types.Update.de_json(data)
    bot.process_new_updates([update])
    return {"ok": True}

# Web App
app.mount("/static", StaticFiles(directory="webapp"), name="static")

@app.get("/")
def home():
    return FileResponse("webapp/index.html")

# Start handler
@bot.message_handler(commands=["start"])
def start_handler(message):
    kb = telebot.types.InlineKeyboardMarkup()
    kb.add(
        telebot.types.InlineKeyboardButton(
            "🚀 دخول التطبيق",
            web_app=telebot.types.WebAppInfo(
                url="https://ggerscoin-production.up.railway.app/"
            )
        )
    )
    bot.send_message(
        message.chat.id,
        "👋 أهلاً بك\nاضغط الزر للدخول",
        reply_markup=kb
    )

# Set webhook once
@app.on_event("startup")
async def on_startup():
    bot.remove_webhook()
    bot.set_webhook(url=WEBHOOK_URL)
