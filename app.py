from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import telebot
from database import init_db
from models import get_user, create_user
from fastapi import Body
@app.on_event("startup")
async def startup_event():
    init_db()
    @app.post("/api/auth")
def auth_user(user: dict = Body(...)):
    existing = get_user(user["id"])

    if not existing:
        create_user(user)
        return {"status": "created"}
    
    return {"status": "exists"}
BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
APP_URL   = "https://web-production-1ba0e.up.railway.app"

BOT_NAME = "GgersCoin Bot"

bot = telebot.TeleBot(BOT_TOKEN)
app = FastAPI()

# ===== Telegram Webhook =====
@app.post("/webhook")
async def telegram_webhook(req: Request):
    update = telebot.types.Update.de_json(await req.json())
    bot.process_new_updates([update])
    return {"ok": True}

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
        f"👋 أهلاً بك في *{BOT_NAME}*\n\nاضغط الزر للدخول إلى التطبيق",
        reply_markup=kb,
        parse_mode="Markdown"
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
