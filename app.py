import os
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from aiogram import Bot, Dispatcher
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.filters import CommandStart

# =============================
# الإعدادات
# =============================
BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
APP_URL   = "https://web-production-2f18d.up.railway.app"

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()
app = FastAPI()

# =============================
# رسالة /start + زر WebApp
# =============================
@dp.message(CommandStart())
async def start_handler(message: Message):
    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🚀 دخول التطبيق",
                    web_app=WebAppInfo(url=APP_URL)
                )
            ]
        ]
    )

    await message.answer(
        """👋 أهلاً بك!

هذا التطبيق عبارة عن تجربة تفاعلية داخل Telegram.

👇 اضغط على الزر بالأسفل للدخول إلى التطبيق.
""",
        reply_markup=kb
    )

# =============================
# Webhook من Telegram
# =============================
@app.post("/webhook")
async def telegram_webhook(request: Request):
    update = await request.json()
    await dp.feed_webhook_update(bot, update)
    return {"ok": True}

# =============================
# WebApp
# =============================
@app.get("/")
async def home():
    return FileResponse("webapp/index.html")

# =============================
# Startup
# =============================
@app.on_event("startup")
async def on_startup():
    await bot.delete_webhook(drop_pending_updates=True)
    await bot.set_webhook(f"{APP_URL}/webhook")
    print("✅ Bot webhook set")
