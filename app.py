from fastapi import FastAPI, Request, Body
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import telebot
import sqlite3
import os

# =============================
# الإعدادات
# =============================
BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
APP_URL = "https://web-production-1ba0e.up.railway.app"
BOT_NAME = "GgersCoin Bot"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEBAPP_DIR = os.path.join(BASE_DIR, "webapp")
DB_NAME = os.path.join(BASE_DIR, "database.db")

# =============================
# إنشاء التطبيق والبوت
# =============================
app = FastAPI()
bot = telebot.TeleBot(BOT_TOKEN, threaded=False)

# =============================
# قاعدة البيانات
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

# =============================
# Startup
# =============================
@app.on_event("startup")
async def on_startup():
    init_db()
    bot.remove_webhook()
    bot.set_webhook(url=f"{APP_URL}/webhook")

# =============================
# Telegram Webhook
# =============================
@app.post("/webhook")
async def telegram_webhook(request: Request):
    data = await request.json()
    update = telebot.types.Update.de_json(data)
    bot.process_new_updates([update])
    return JSONResponse({"ok": True})

# =============================
# /start – رسالة ترحيب قوية
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

    welcome_text = f"""
🌱 *مرحبًا بك في {BOT_NAME}* 🌱

هنا تبدأ رحلتك في لعبة المزرعة 👨‍🌾

🔹 ازرع المحاصيل
🔹 انتظر وقت النمو
🔹 احصد وكسب نقاط
🔹 نفّذ المهمات اليومية
🔹 افتح أراضي جديدة
🔹 طوّر حسابك مع VIP

💰 كلما لعبت أكثر → ربحت نقاط أكثر  
🚀 اللعب سهل – ممتع – ومتاح للجميع  

اضغط الزر بالأسفل وابدأ اللعب فورًا 👇
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
    exists = cursor.fetchone()

    if not exists:
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
# SPA Fallback
# =============================
@app.get("/{path:path}")
def fallback(path: str):
    file_path = os.path.join(WEBAPP_DIR, path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))

# =============================
# Farm API
# =============================
from api.farm.lands import router as lands_router
app.include_router(lands_router)
