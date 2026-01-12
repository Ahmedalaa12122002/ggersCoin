from fastapi import FastAPI, Request
from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
import logging

BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
WEB_APP_URL = "https://web-production-1ba0e.up.railway.app"
WEBHOOK_PATH = "/webhook"

logging.basicConfig(level=logging.INFO)

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot)

@dp.message_handler(commands=["start"])
async def start(message: types.Message):
    keyboard = InlineKeyboardMarkup().add(
        InlineKeyboardButton(
            text="🌱 Play Now",
            web_app=WebAppInfo(url=WEB_APP_URL)
        )
    )
    await message.answer("Welcome to Farm Game 🌱", reply_markup=keyboard)

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok"}

@app.post(WEBHOOK_PATH)
async def telegram_webhook(req: Request):
    update = types.Update(**await req.json())
    await dp.process_update(update)
    return {"ok": True}

@app.on_event("startup")
async def on_startup():
    await bot.set_webhook(WEB_APP_URL + WEBHOOK_PATH)
