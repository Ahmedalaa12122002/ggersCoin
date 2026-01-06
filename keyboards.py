from telebot import types
import os

WEB_APP_URL = os.getenv("https://ggerscoin-production.up.railway.app/")

def start_keyboard():
    note = types.InlineKeyboardMarkup()
    note.add(
        types.InlineKeyboardButton(
            text="🚀 دخول التطبيق",
            web_app=types.WebAppInfo(url=WEB_APP_URL)
        )
    )
    return note
