import os
import logging
import hashlib
import hmac
import json

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.utils.executor import start_webhook

# ======================
# CONFIG
# ======================
BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
WEB_APP_URL = "https://web-production-1ba0e.up.railway.app/"
WEBHOOK_PATH = "/telegram/webhook"
WEBHOOK_URL = WEB_APP_URL.rstrip("/") + WEBHOOK_PATH

logging.basicConfig(level=logging.INFO)

# ======================
# BOT
# ======================
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot, storage=MemoryStorage())

@dp.message_handler(commands=["start"])
async def start_cmd(message: types.Message):
    keyboard = InlineKeyboardMarkup()
    keyboard.add(
        InlineKeyboardButton(
            text="🌱 Play Now | ابدأ اللعب",
            web_app=WebAppInfo(url=WEB_APP_URL)
        )
    )

    await message.answer(
        "🌱 أهلاً بيك في لعبة المزرعة!\n\n"
        "ازرع 🌾 واحصد 🧺 وكسب نقاط 💰\n"
        "النقاط = أموال حقيقية 💸\n\n"
        "👇 اضغط Play وابدأ",
        reply_markup=keyboard
    )

# ======================
# FASTAPI
# ======================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok", "message": "Web + Bot via Webhook running"}

@app.post(WEBHOOK_PATH)
async def telegram_webhook(req: Request):
    data = await req.json()
    update = types.Update(**data)
    await dp.process_update(update)
    return {"ok": True}

# ======================
# STARTUP / SHUTDOWN
# ======================
@app.on_event("startup")
async def on_startup():
    await bot.set_webhook(WEBHOOK_URL)
    logging.info("Webhook set")

@app.on_event("shutdown")
async def on_shutdown():
    await bot.delete_webhook()
