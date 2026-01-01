import telebot
import os
from datetime import date
from db import init_db, add_user, get_user, update_daily

BOT_TOKEN = os.environ.get("BOT_TOKEN")
bot = telebot.TeleBot(BOT_TOKEN)

init_db()

@bot.message_handler(commands=['start'])
def start(message):
    user_id = message.from_user.id
    username = message.from_user.username
    add_user(user_id, username)

    bot.send_message(
        message.chat.id,
        "👋 أهلاً بك في GgersCoin\n\n"
        "🎁 استخدم الأمر /daily للحصول على المكافأة اليومية\n"
        "💰 استخدم الأمر /points لمعرفة رصيدك"
    )

@bot.message_handler(commands=['daily'])
def daily(message):
    user_id = message.from_user.id
    data = get_user(user_id)

    if not data:
        bot.send_message(message.chat.id, "❌ حدث خطأ، أرسل /start")
        return

    points, last_daily, streak = data
    today = date.today()

    if last_daily == today:
        bot.send_message(message.chat.id, "⏳ لقد حصلت على مكافأة اليوم بالفعل")
        return

    if last_daily == today.replace(day=today.day - 1):
        streak += 1
    else:
        streak = 1

    reward = 50 + (streak - 1) * 5
    if reward > 80:
        reward = 80

    update_daily(user_id, reward, streak)

    bot.send_message(
        message.chat.id,
        f"🎉 مكافأة يومية!\n\n"
        f"🔥 اليوم المتتالي: {streak}\n"
        f"💰 حصلت على: {reward} نقطة"
    )

@bot.message_handler(commands=['points'])
def points(message):
    user_id = message.from_user.id
    data = get_user(user_id)

    if not data:
        bot.send_message(message.chat.id, "❌ حدث خطأ")
        return

    points, _, _ = data
    usd = points / 10000

    bot.send_message(
        message.chat.id,
        f"💰 رصيدك الحالي:\n\n"
        f"🔸 {points} نقطة\n"
        f"💵 ≈ {usd:.2f} دولار"
    )

print("Bot is running...")
bot.infinity_polling()
