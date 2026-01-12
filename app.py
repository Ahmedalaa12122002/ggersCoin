import asyncio
import logging
import os
import threading

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.utils import executor

# ======================
# CONFIG
# ======================
BOT_TOKEN = os.getenv("BOT_TOKEN") or "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
WEB_APP_URL = "https://web-production-1ba0e.up.railway.app/"

logging.basicConfig(level=logging.INFO)

# ======================
# FASTAPI (WEB)
# ======================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "message": "Web + Bot running together"}

# ======================
# TELEGRAM BOT
# ======================
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot)

@dp.message_handler(commands=["start"])
async def start(message: types.Message):
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
# RUN BOT IN BACKGROUND
# ======================
def run_bot():
    executor.start_polling(dp, skip_updates=True)

@app.on_event("startup")
async def startup_event():
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, run_bot)
