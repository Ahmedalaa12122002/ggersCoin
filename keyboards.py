from telebot import types

WEB_APP_URL = "https://ggerscoin-production.up.railway.app/"

def start_keyboard():
    kb = types.InlineKeyboardMarkup()
    kb.add(
        types.InlineKeyboardButton(
            text="🚀 دخول التطبيق",
            web_app=types.WebAppInfo(url=WEB_APP_URL)
        )
    )
    return kb
