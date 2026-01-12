import os
import asyncio
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

# =====================
# CONFIG
# =====================
BOT_TOKEN = os.getenv("BOT_TOKEN") or "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
WEB_APP_URL = "https://web-production-1ba0e.up.railway.app/"

logging.basicConfig(level=logging.INFO)

# =====================
# FASTAPI
# =====================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok", "message": "Web + Bot running"}

# =====================
# TELEGRAM BOT
# =====================
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(commands=["start"])
async def start_cmd(message: types.Message):
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🌱 Play Now | ابدأ اللعب",
                    web_app=WebAppInfo(url=WEB_APP_URL)
                )
            ]
        ]
    )

    await message.answer(
        "🌱 أهلاً بيك في لعبة المزرعة!\n\n"
        "ازرع 🌾 واحصد 🧺 وكسب نقاط 💰\n"
        "النقاط = أموال حقيقية 💸\n\n"
        "👇 اضغط Play وابدأ",
        reply_markup=keyboard
    )

# =====================
# START BOT SAFELY
# =====================
async def start_bot():
    await dp.start_polling(bot)

@app.on_event("startup")
async def on_startup():
    asyncio.create_task(start_bot())
