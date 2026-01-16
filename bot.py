import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

BOT_TOKEN = "8283096353:AAEJhU6xnnZtlzake_gdUM0Zd24-5XepAxw"
WEB_APP_URL = "https://web-production-33147.up.railway.app"

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=["start"])
def start(message):
    kb = InlineKeyboardMarkup()
    kb.add(
        InlineKeyboardButton(
            "🚀 دخول التطبيق",
            web_app=WebAppInfo(url=WEB_APP_URL)
        )
    )

    bot.send_message(
        message.chat.id,
        "👋 أهلاً بك\n\nاضغط الزر للدخول 👇",
        reply_markup=kb
    )

print("Bot started")
bot.infinity_polling(skip_pending=True)
