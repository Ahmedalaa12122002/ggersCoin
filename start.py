# bot/start.py

from keyboards import start_keyboard

def start_message(bot, message):
    text = (
        "👋 أهلاً بك في التطبيق\n\n"
        "💡 من هنا يمكنك إدارة كل شيء بسهولة\n"
        "👇 اضغط على الزر للدخول إلى التطبيق"
    )
    bot.send_message(
        chat_id=message.chat.id,
        text=text,
        reply_markup=start_keyboard()
    )
