import logging
from fastapi import FastAPI, Request
from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

# ======================
# الإعدادات
# ======================
BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"

# ⚠️ حط رابط Railway بعد النشر
BASE_URL = "https://YOUR-PROJECT.up.railway.app"
WEBHOOK_PATH = "/telegram/webhook"
WEBHOOK_URL = BASE_URL + WEBHOOK_PATH

WEB_APP_URL = BASE_URL  # الويب نفسه

logging.basicConfig(level=logging.INFO)

# ======================
# Telegram Bot
# ======================
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot)

@dp.message_handler(commands=["start"])
async def start_handler(message: types.Message):
    keyboard = InlineKeyboardMarkup()
    keyboard.add(
        InlineKeyboardButton(
            text="🚀 دخول اللعبة",
            web_app=WebAppInfo(url=WEB_APP_URL)
        )
    )

    await message.answer(
        "👋 أهلاً بيك في لعبة المزرعة 🌱\n\n"
        "اضغط على الزر وابدأ اللعب 👇",
        reply_markup=keyboard
    )

# ======================
# FastAPI
# ======================
app = FastAPI()

@app.get("/")
async def root():
    return {"status": "ok", "message": "Bot + WebApp running"}

@app.post(WEBHOOK_PATH)
async def telegram_webhook(request: Request):
    data = await request.json()
    update = types.Update(**data)
    await dp.process_update(update)
    return {"ok": True}

@app.on_event("startup")
async def on_startup():
    await bot.set_webhook(WEBHOOK_URL)
    logging.info(f"Webhook set to {WEBHOOK_URL}")
