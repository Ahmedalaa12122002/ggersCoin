from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import telebot

BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
WEB_APP_URL = "https://YOUR_PROJECT.up.railway.app/"

bot = telebot.TeleBot(BOT_TOKEN)
app = FastAPI()

# ===== Telegram Webhook =====
@app.post("/webhook")
async def telegram_webhook(request: Request):
    data = await request.json()
    update = telebot.types.Update.de_json(data)
    bot.process_new_updates([update])
    return {"ok": True}

@bot.message_handler(commands=["start"])
def start_handler(message):
    kb = telebot.types.InlineKeyboardMarkup()
    kb.add(
        telebot.types.InlineKeyboardButton(
            "🚀 دخول التطبيق",
            web_app=telebot.types.WebAppInfo(url=WEB_APP_URL)
        )
    )
    bot.send_message(
        message.chat.id,
        "👋 أهلاً بك\n\nاضغط الزر للدخول إلى التطبيق",
        reply_markup=kb
    )

@app.on_event("startup")
async def startup():
    bot.remove_webhook()
    bot.set_webhook(url=WEB_APP_URL + "webhook")

# ===== Web App =====
app.mount("/static", StaticFiles(directory="webapp"), name="static")

@app.get("/")
def home():
    return FileResponse("webapp/index.html")
