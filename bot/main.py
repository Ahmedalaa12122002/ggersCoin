from telegram import Update, KeyboardButton, ReplyKeyboardMarkup, WebAppInfo
from telegram.ext import CommandHandler, ContextTypes

def setup_handlers(application):

    async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
        keyboard = [
            [
                KeyboardButton(
                    text="🚀 دخول تطبيق GgersCoin",
                    web_app=WebAppInfo(
                        url="https://ggerscoin-production.up.railway.app/"
                    )
                )
            ]
        ]

        reply_markup = ReplyKeyboardMarkup(
            keyboard=keyboard,
            resize_keyboard=True
        )

        await update.message.reply_text(
            "👋 أهلاً بك في بوت GgersCoin\n\n"
            "اضغط على الزر بالأسفل للدخول إلى تطبيق الويب 👇",
            reply_markup=reply_markup
        )

    application.add_handler(CommandHandler("start", start))
