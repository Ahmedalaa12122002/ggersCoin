from telegram.ext import ApplicationBuilder
from bot.main import setup_handlers

BOT_TOKEN = "8440388547:AAF8Ftiu7Qmi1GLfHzViIRAzgZE7khvvXC8"

def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    setup_handlers(app)
    app.run_polling()

if __name__ == "__main__":
    main()
