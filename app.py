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
            "🚀 ابدأ اللعب الآن",
            web_app=telebot.types.WebAppInfo(url=APP_URL)
        )
    )

    welcome_text = f"""
🌱 *مرحبًا بك في {BOT_NAME}* 🌱

🎮 هنا تبدأ رحلتك للربح واللعب في نفس الوقت!

💰 كيف تكسب؟
• افتح أرضك الأولى مجانًا
• ازرع المحاصيل 🌾
• انتظر وقت النمو ⏳
• احصد وكسب نقاط 💎
• طوّر حسابك وافتح أراضي أكثر
• فعّل VIP لربح أسرع 🔥

⚡ اللعب سهل – بدون تعقيد  
📱 يعمل مباشرة من تيليجرام  
🚀 كل دقيقة لعب = فرصة ربح

👇 اضغط الزر بالأسفل وابدأ الآن
"""

    bot.send_message(
        message.chat.id,
        welcome_text,
        reply_markup=keyboard,
        parse_mode="Markdown"
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

        # إنشاء إعدادات افتراضية للمستخدم
        cursor.execute("""
        INSERT OR IGNORE INTO user_settings (user_id)
        VALUES (?)
        """, (user.get("id"),))

        db.commit()

    db.close()
    return {"status": "ok"}

# =============================
# API Settings
# =============================
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
        return {
            "vibration": True,
            "theme": "dark"
        }

    return {
        "vibration": bool(row[0]),
        "theme": row[1]
    }

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

# =============================
# Farm API
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
# SPA fallback
# =============================
@app.get("/{path:path}")
def spa_fallback(path: str):
    if path.startswith("api/"):
        return JSONResponse({"error": "Not Found"}, status_code=404)

    file_path = os.path.join(WEBAPP_DIR, path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)

    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))
