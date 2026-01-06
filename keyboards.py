# bot/keyboards.py

from telebot import types
from config import WEB_APP_URL

def start_keyboard():
    keyboard = types.InlineKeyboardMarkup()
    web_app_btn = types.InlineKeyboardButton(
        text="🚀 دخول التطبيق",
        web_app=types.WebAppInfo(url=WEB_APP_URL)
    )
    keyboard.add(web_app_btn)
    return keyboard
