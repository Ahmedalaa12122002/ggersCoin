from fastapi import FastAPI, Request, Body
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import telebot
import sqlite3
import os

BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
APP_URL = "https://web-production-1ba0e.up.railway.app"
BOT_NAME = "GgersCoin Bot"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEBAPP_DIR = os.path.join(BASE_DIR, "webapp")
DB_NAME = os.path.join(BASE_DIR, "database.db")

app = FastAPI()
bot = telebot.TeleBot(BOT_TOKEN, threaded=False)

# ================== DATABASE ==================
def get_db():
    return sqlite3.connect(DB_NAME)

def init_db():
    db = get_db()
    cur = db.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        first_name TEXT,
        username TEXT
    )
    """)
    db.commit()
    db.close()

@app.on_event("startup")
async def startup():
    init_db()
    bot.remove_webhook()
    bot.set_webhook(f"{APP_URL}/webhook")

# ================== TELEGRAM ==================
@app.post("/webhook")
async def webhook(request: Request):
    data = await request.json()
    update = telebot.types.Update.de_json(data)
    bot.process_new_updates([update])
    return {"ok": True}

@bot.message_handler(commands=["start"])
def start(message):
    kb = telebot.types.InlineKeyboardMarkup()
    kb.add(
        telebot.types.InlineKeyboardButton(
            "🚀 دخول اللعبة",
            web_app=telebot.types.WebAppInfo(url=APP_URL)
        )
    )
    bot.send_message(
        message.chat.id,
        f"👋 أهلاً بك في *{BOT_NAME}*",
        reply_markup=kb,
        parse_mode="Markdown"
    )

# ================== API ==================
@app.post("/api/auth")
def auth(user: dict = Body(...)):
    db = get_db()
    cur = db.cursor()
    cur.execute("INSERT OR IGNORE INTO users VALUES (?, ?, ?)",
                (user["id"], user.get("first_name"), user.get("username")))
    db.commit()
    db.close()
    return {"ok": True}

@app.get("/api/farm/lands")
def farm_lands():
    return {
        "lands": [
            {"id": 1, "open": True},
            {"id": 2, "open": False},
            {"id": 3, "open": False},
            {"id": 4, "open": False},
        ]
    }

# ================== STATIC ==================
app.mount("/webapp", StaticFiles(directory=WEBAPP_DIR), name="webapp")

@app.get("/")
def index():
    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))

@app.get("/{path:path}")
def fallback(path: str):
    file_path = os.path.join(WEBAPP_DIR, path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))
