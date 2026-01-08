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

app = FastAPI(title="GgersCoin API")
bot = telebot.TeleBot(BOT_TOKEN, threaded=False)

# =============================
# Database
# =============================
def get_db():
    return sqlite3.connect(DB_NAME)

def init_db():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        username TEXT,
        language TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    db.commit()
    db.close()

@app.on_event("startup")
async def on_startup():
    init_db()
    try:
        bot.remove_webhook()
        bot.set_webhook(url=f"{APP_URL}/webhook")
    except Exception as e:
        print("Telegram error:", e)

# =============================
# Telegram Webhook
# =============================
@app.post("/webhook")
async def telegram_webhook(request: Request):
    data = await request.json()
    update = telebot.types.Update.de_json(data)
    bot.process_new_updates([update])
    return {"ok": True}

# =============================
# Telegram /start
# =============================
@bot.message_handler(commands=["start"])
def start_handler(message):
    keyboard = telebot.types.InlineKeyboardMarkup()
    keyboard.add(
        telebot.types.InlineKeyboardButton(
            "🌱 ابدأ اللعب الآن",
            web_app=telebot.types.WebAppInfo(url=APP_URL)
        )
    )

    bot.send_message(
        message.chat.id,
        f"🌱 مرحبًا بك في {BOT_NAME}",
        reply_markup=keyboard
    )

# =============================
# API Auth
# =============================
@app.post("/api/auth")
def auth_user(user: dict = Body(...)):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id FROM users WHERE id = ?", (user.get("id"),))
    if not cursor.fetchone():
        cursor.execute("""
        INSERT INTO users (id, first_name, last_name, username, language)
        VALUES (?, ?, ?, ?, ?)
        """, (
            user.get("id"),
            user.get("first_name"),
            user.get("last_name"),
            user.get("username"),
            user.get("language")
        ))
        db.commit()
    db.close()
    return {"status": "ok"}

# =============================
# 🔥 Farm API (قبل fallback)
# =============================
from api.farm.lands import router as lands_router
app.include_router(lands_router)

# =============================
# Static files
# =============================
app.mount("/static", StaticFiles(directory=WEBAPP_DIR), name="static")

# =============================
# Main page
# =============================
@app.get("/")
def serve_index():
    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))

# =============================
# SPA fallback (بدون API)
# =============================
@app.get("/{path:path}")
def spa_fallback(path: str):
    if path.startswith("api/"):
        return JSONResponse({"error": "Not Found"}, status_code=404)

    file_path = os.path.join(WEBAPP_DIR, path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)

    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))
