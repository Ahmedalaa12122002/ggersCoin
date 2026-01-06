from telegram import Update, KeyboardButton, ReplyKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

def setup_handlers(app):

    async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
        keyboard = [
            [
                KeyboardButton(
                    text="🚀 تشغيل التطبيق",
                    web_app=WebAppInfo(
                        url="https://example.com"  # مؤقت
                    )
                )
            ]
        ]

        reply_markup = ReplyKeyboardMarkup(
            keyboard=keyboard,
            resize_keyboard=True
        )

        await update.message.reply_text(
            "👋 أهلاً بك\n"
            "اضغط على الزر لتشغيل التطبيق",
            reply_markup=reply_markup
        )

    app.add_handler(CommandHandler("start", start))
