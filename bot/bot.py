from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.utils import executor

BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
WEB_APP_URL = "https://web-production-1ba0e.up.railway.app/"

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
        "👇 اضغط Play وابدأ",
        reply_markup=keyboard
    )

executor.start_polling(dp, skip_updates=True)
