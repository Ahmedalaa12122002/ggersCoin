from keyboards import start_keyboard

def start_message(bot, message):
    bot.send_message(
        chat_id=message.chat.id,
        text=(
            "👋 أهلاً بك في Pram points\n\n"
            "🚀 اضغط على الزر بالأسفل للدخول إلى التطبيق"
        ),
        reply_markup=start_keyboard()
    )
