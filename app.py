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

    # ===== Users =====
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

    # ===== User Settings =====
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_settings (
        user_id INTEGER PRIMARY KEY,
        vibration INTEGER DEFAULT 1,
        theme TEXT DEFAULT 'dark'
    )
    """)

    # ===== Devices (Security) =====
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
    try:
        bot.remove_webhook()
        bot.set_webhook(url=f"{APP_URL}/webhook")
    except Exception as e:
        print("Telegram error:", e)

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
💰 ازرع – احصد – اجمع نقاط  
🔥 فعّل VIP لربح أسرع

👇 اضغط الزر وابدأ الآن
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
# 🔒 GLOBAL SECURITY MIDDLEWARE
# ======================================================
@app.middleware("http")
async def telegram_only_middleware(request: Request, call_next):
    path = request.url.path

    # السماح للويبهوك والستاتيك
    if path.startswith("/webhook") or path.startswith("/static"):
        return await call_next(request)

    # السماح للـ API فقط لو فيه initData
    if path.startswith("/api"):
        init_data = request.headers.get("X-Init-Data")
        if not init_data or not verify_telegram_init_data(init_data):
            return JSONResponse(
                {"error": "Forbidden – Telegram only"},
                status_code=403
            )

    return await call_next(request)

# ======================================================
# API Auth (Protected)
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

    # ===== Device limit (max 4 users) =====
    cursor.execute(
        "SELECT COUNT(DISTINCT user_id) FROM devices WHERE device_id = ?",
        (x_device_id,)
    )
    count = cursor.fetchone()[0]
    if count >= 4:
        db.close()
        return JSONResponse(
            {"error": "Device limit reached (4 accounts max)"},
            status_code=403
        )

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

        cursor.execute("""
        INSERT OR IGNORE INTO user_settings (user_id)
        VALUES (?)
        """, (user.get("id"),))

    cursor.execute("""
    INSERT OR IGNORE INTO devices (device_id, user_id)
    VALUES (?, ?)
    """, (x_device_id, user.get("id")))

    db.commit()
    db.close()
    return {"status": "ok"}

# ======================================================
# API Profile
# ======================================================
@app.get("/api/profile/{user_id}")
def get_profile(user_id: int):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
    SELECT first_name, last_name, username
    FROM users WHERE id = ?
    """, (user_id,))
    row = cursor.fetchone()
    db.close()

    if not row:
        return JSONResponse({"error": "User not found"}, status_code=404)

    return {
        "first_name": row[0],
        "last_name": row[1],
        "username": row[2]
    }

# ======================================================
# API Settings
# ======================================================
@app.get("/api/settings/{user_id}")
def get_settings(user_id: int):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
    SELECT vibration, theme FROM user_settings WHERE user_id = ?
    """, (user_id,))
    row = cursor.fetchone()
    db.close()

    if not row:
        return {"vibration": True, "theme": "dark"}

    return {"vibration": bool(row[0]), "theme": row[1]}

@app.post("/api/settings/{user_id}")
def update_settings(user_id: int, data: dict = Body(...)):
    vibration = 1 if data.get("vibration", True) else 0
    theme = data.get("theme", "dark")

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
    INSERT INTO user_settings (user_id, vibration, theme)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id)
    DO UPDATE SET vibration = ?, theme = ?
    """, (user_id, vibration, theme, vibration, theme))

    db.commit()
    db.close()
    return {"status": "ok"}

# ======================================================
# Farm API
# ======================================================
from api.farm.lands import router as lands_router
app.include_router(lands_router)

# ======================================================
# Static files
# ======================================================
app.mount("/static", StaticFiles(directory=WEBAPP_DIR), name="static")

# ======================================================
# Main page (Telegram only)
# ======================================================
@app.get("/")
def serve_index(request: Request):
    if not request.headers.get("X-Init-Data"):
        return JSONResponse(
            {"error": "Telegram WebApp only"},
            status_code=403
        )
    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))

# ======================================================
# SPA fallback
# ======================================================
@app.get("/{path:path}")
def spa_fallback(path: str, request: Request):
    if path.startswith("api/"):
        return JSONResponse({"error": "Not Found"}, status_code=404)

    if not request.headers.get("X-Init-Data"):
        return JSONResponse(
            {"error": "Telegram WebApp only"},
            status_code=403
        )

    file_path = os.path.join(WEBAPP_DIR, path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)

    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))
