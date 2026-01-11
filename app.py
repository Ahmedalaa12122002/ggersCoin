from fastapi import FastAPI, Request, Body, Header
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import telebot
import sqlite3
import os
import hmac
import hashlib
import urllib.parse
import time

BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
APP_URL = "https://web-production-1ba0e.up.railway.app"
BOT_NAME = "GgersCoin Bot"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEBAPP_DIR = os.path.join(BASE_DIR, "webapp")
DB_NAME = os.path.join(BASE_DIR, "database.db")

app = FastAPI(title="GgersCoin API")
bot = telebot.TeleBot(BOT_TOKEN, threaded=False)

# ======================================================
# Database
# ======================================================
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

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_settings (
        user_id INTEGER PRIMARY KEY,
        vibration INTEGER DEFAULT 1,
        theme TEXT DEFAULT 'dark'
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS devices (
        device_id TEXT,
        user_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(device_id, user_id)
    )
    """)

    db.commit()
    db.close()

@app.on_event("startup")
async def on_startup():
    init_db()

# ======================================================
# Telegram Webhook
# ======================================================
@app.post("/webhook")
async def telegram_webhook(request: Request):
    data = await request.json()
    update = telebot.types.Update.de_json(data)
    bot.process_new_updates([update])
    return {"ok": True}

# ======================================================
# Telegram /start
# ======================================================
@bot.message_handler(commands=["start"])
def start_handler(message):
    keyboard = telebot.types.InlineKeyboardMarkup()
    keyboard.add(
        telebot.types.InlineKeyboardButton(
            "🚀 ابدأ اللعب الآن",
            web_app=telebot.types.WebAppInfo(url=APP_URL)
        )
    )

    welcome_text = f"""
🌱 *مرحبًا بك في {BOT_NAME}* 🌱

🎮 العب واربح في نفس الوقت  
💰 ازرع • احصد • اجمع نقاط  
🔥 فعّل VIP لربح أسرع
"""

    bot.send_message(
        message.chat.id,
        welcome_text,
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

# ======================================================
# Telegram initData verification
# ======================================================
def verify_telegram_init_data(init_data: str) -> bool:
    try:
        parsed = dict(urllib.parse.parse_qsl(init_data))
        hash_from_telegram = parsed.pop("hash", None)

        data_check_string = "\n".join(
            f"{k}={v}" for k, v in sorted(parsed.items())
        )

        secret_key = hashlib.sha256(BOT_TOKEN.encode()).digest()
        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()

        if calculated_hash != hash_from_telegram:
            return False

        if "auth_date" in parsed:
            if time.time() - int(parsed["auth_date"]) > 86400:
                return False

        return True
    except Exception:
        return False

# ======================================================
# API Auth
# ======================================================
@app.post("/api/auth")
def auth_user(
    user: dict = Body(...),
    x_init_data: str = Header(None),
    x_device_id: str = Header(None)
):
    if not x_init_data or not verify_telegram_init_data(x_init_data):
        return JSONResponse({"error": "Unauthorized"}, status_code=401)

    if not x_device_id:
        return JSONResponse({"error": "Device ID required"}, status_code=400)

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "SELECT COUNT(DISTINCT user_id) FROM devices WHERE device_id = ?",
        (x_device_id,)
    )
    if cursor.fetchone()[0] >= 4:
        db.close()
        return JSONResponse(
            {"error": "Device limit reached (4 accounts max)"},
            status_code=403
        )

    cursor.execute("SELECT id FROM users WHERE id = ?", (user["id"],))
    if not cursor.fetchone():
        cursor.execute("""
        INSERT INTO users (id, first_name, last_name, username, language)
        VALUES (?, ?, ?, ?, ?)
        """, (
            user["id"],
            user["first_name"],
            user["last_name"],
            user["username"],
            user["language"]
        ))

        cursor.execute(
            "INSERT OR IGNORE INTO user_settings (user_id) VALUES (?)",
            (user["id"],)
        )

    cursor.execute(
        "INSERT OR IGNORE INTO devices (device_id, user_id) VALUES (?, ?)",
        (x_device_id, user["id"])
    )

    db.commit()
    db.close()
    return {"status": "ok"}

# ======================================================
# API Settings
# ======================================================
@app.get("/api/settings/{user_id}")
def get_settings(user_id: int):
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "SELECT vibration, theme FROM user_settings WHERE user_id = ?",
        (user_id,)
    )
    row = cursor.fetchone()
    db.close()

    return {
        "vibration": bool(row[0]) if row else True,
        "theme": row[1] if row else "dark"
    }

@app.post("/api/settings/{user_id}")
def update_settings(user_id: int, data: dict = Body(...)):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
    INSERT INTO user_settings (user_id, vibration, theme)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id)
    DO UPDATE SET vibration=?, theme=?
    """, (
        user_id,
        int(data.get("vibration", True)),
        data.get("theme", "dark"),
        int(data.get("vibration", True)),
        data.get("theme", "dark")
    ))

    db.commit()
    db.close()
    return {"status": "ok"}

# ======================================================
# Static files
# ======================================================
app.mount("/static", StaticFiles(directory=WEBAPP_DIR), name="static")

# ======================================================
# Frontend
# ======================================================
@app.get("/")
def serve_index():
    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))

@app.get("/{path:path}")
def spa_fallback(path: str):
    file_path = os.path.join(WEBAPP_DIR, path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))
