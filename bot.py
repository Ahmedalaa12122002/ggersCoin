import telebot
from start import start_message

BOT_TOKEN = "8088771179:AAGvjDfgYc8LbwMhCyO1cgR-5zPdqYllhwE"

bot = telebot.TeleBot(BOT_TOKEN)

# مهم جدًا لمنع أي تعارض قديم
bot.delete_webhook(drop_pending_updates=True)

@bot.message_handler(commands=["start"])
def handle_start(message):
    start_message(bot, message)

print("BOT STARTED SUCCESSFULLY")
bot.infinity_polling(skip_pending=True)
