from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.utils import executor
import logging

BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
WEB_APP_URL = "https://web-production-1ba0e.up.railway.app/"

logging.basicConfig(level=logging.INFO)

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot)

@dp.message_handler(commands=["start"])
async def start(message: types.Message):
    keyboard = InlineKeyboardMarkup(row_width=1)
    keyboard.add(
        InlineKeyboardButton(
            text="🌱 Play Now | ابدأ اللعب",
            web_app=WebAppInfo(url=WEB_APP_URL)
        )
    )

    welcome_text = (
        "🌱 أهلاً بيك في لعبة المزرعة الذكية!\n\n"
        "ازرع 🌾، احصد 🧺، وكبّر مزرعتك خطوة بخطوة.\n"
        "كل لعب = نقاط 💰\n"
        "وتقدر تحولها لأموال حقيقية 💸\n\n"
        "🔐 نظام آمن 100%\n\n"
        "👇 اضغط على الزر وابدأ اللعب"
    )

    await message.answer(welcome_text, reply_markup=keyboard)

if __name__ == "__main__":
    print("🤖 Bot is running...")
    executor.start_polling(dp, skip_updates=True)
