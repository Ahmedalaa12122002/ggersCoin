import os
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import telebot

# ========= الإعدادات =========
BOT_TOKEN = os.environ.get("8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ")
APP_URL   = os.environ.get("https://web-production-1ba0e.up.railway.app/")  # https://web-production-xxxx.up.railway.app
BOT_NAME  = "GgersCoin Bot"  # غيّر الاسم لو حابب

bot = telebot.TeleBot(BOT_TOKEN)
app = FastAPI()

# ========= Telegram Webhook =========
@app.post("/webhook")
async def telegram_webhook(req: Request):
    update = telebot.types.Update.de_json(await req.json())
    bot.process_new_updates([update])
    return {"ok": True}

@bot.message_handler(commands=["start"])
def start_handler(message):
    keyboard = telebot.types.InlineKeyboardMarkup()
    keyboard.add(
        telebot.types.InlineKeyboardButton(
            "🚀 دخول التطبيق",
            web_app=telebot.types.WebAppInfo(url=APP_URL)
        )
    )

    bot.send_message(
        message.chat.id,
        f"👋 أهلاً بك في *{BOT_NAME}*\n\n"
        "من هنا تقدر تدخل التطبيق وتبدأ الاستخدام 👇",
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

@app.on_event("startup")
async def on_startup():
    bot.remove_webhook()
    bot.set_webhook(url=f"{APP_URL}/webhook")

# ========= Web App =========
app.mount("/static", StaticFiles(directory="webapp"), name="static")

@app.get("/")
def home():
    return FileResponse("webapp/index.html")
