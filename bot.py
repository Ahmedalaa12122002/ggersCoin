from telegram import Update, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from db import init_db

TOKEN = "8374900683:AAGBZ9Ni4jpsLDr0nemtPrJXL7U0nIZxskQ"
WEB_URL = "https://ggerscoin-production.up.railway.app/"

init_db()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    kb = ReplyKeyboardMarkup(
        [[KeyboardButton("🚀 دخول التطبيق", web_app=WebAppInfo(url=WEB_URL))]],
        resize_keyboard=True
    )
    await update.message.reply_text(
        "👋 أهلاً بك في **GgersCoin**\n\n"
        "🎮 العب واربح نقاط\n"
        "⭐ ميزات VIP قادمة\n"
        "🎁 مكافأة يومية",
        reply_markup=kb
    )

app = ApplicationBuilder().token(TOKEN).build()
app.add_handler(CommandHandler("start", start))
app.run_polling()
