import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

BOT_TOKEN = "8374900683:AAGBZ9Ni4jpsLDr0nemtPrJXL7U0nIZxskQ"
WEBAPP_URL = "https://ggerscoin-production.up.railway.app/"

bot = telebot.TeleBot(BOT_TOKEN, parse_mode="HTML")

@bot.message_handler(commands=["start"])
def start(message):
    kb = InlineKeyboardMarkup()
    kb.add(
        InlineKeyboardButton(
            "🚀 دخول تطبيق GgersCoin",
            web_app={"url": WEBAPP_URL}
        )
    )

    bot.send_message(
        message.chat.id,
        """
👋 <b>مرحبًا بك في GgersCoin</b>

💰 اكسب نقاط
🎯 نفّذ مهام
⭐ ترقية VIP
🎮 ألعاب ذكية
💸 سحب أرباحك

⬇️ اضغط الزر بالأسفل للدخول إلى التطبيق
        """,
        reply_markup=kb
    )

print("Bot is running...")
bot.infinity_polling()
