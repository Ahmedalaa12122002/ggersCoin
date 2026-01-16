from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import telebot
import os, time, hashlib, hmac, urllib.parse

# =====================
# الإعدادات
# =====================
BOT_TOKEN = "8283096353:AAEJhU6xnnZtlzake_gdUM0Zd24-5XepAxw"
APP_URL = "https://web-production-33147.up.railway.app"

MAX_USERS_PER_DEVICE = 2

bot = telebot.TeleBot(BOT_TOKEN, threaded=True)
app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEBAPP_DIR = os.path.join(BASE_DIR, "webapp")

# =====================
#s تخزين مؤقت (لاحقًا DB)
# =====================
DEVICE_USERS = {}

# =====================
# verify initData
# =====================
def verify_init_data(init_data: str):
    parsed = dict(urllib.parse.parse_qsl(init_data))
    hash_telegram = parsed.pop("hash", None)

    if not hash_telegram:
        raise HTTPException(401, "Invalid initData")

    data_check = "\n".join(f"{k}={v}" for k, v in sorted(parsed.items()))
    secret_key = hashlib.sha256(BOT_TOKEN.encode()).digest()

    calc_hash = hmac.new(
        secret_key,
        data_check.encode(),
        hashlib.sha256
    ).hexdigest()

    if calc_hash != hash_telegram:
        raise HTTPException(401, "Invalid signature")

    auth_date = int(parsed.get("auth_date", 0))
    if time.time() - auth_date > 86400:
        raise HTTPException(401, "Expired")

    return eval(parsed["user"])

# =====================
# Telegram webhook
# =====================
@app.post("/webhook")
async def telegram_webhook(request: Request):
    data = await request.json()
    update = telebot.types.Update.de_json(data)
    bot.process_new_updates([update])
    return {"ok": True}

# =====================
# /start
# =====================
@bot.message_handler(commands=["start"])
def start_handler(message):
    kb = telebot.types.InlineKeyboardMarkup()
    kb.add(
        telebot.types.InlineKeyboardButton(
            "🚀 دخول التطبيق",
            web_app=telebot.types.WebAppInfo(url=APP_URL)
        )
    )

    bot.send_message(
        message.chat.id,
        """
👋 أهلاً بك في تجربة تفاعلية 🌱

🎮 العب وأنجز مهام
⭐ طوّر مستواك
🎁 مكافآت داخلية

👇 اضغط وابدأ
""",
        reply_markup=kb
    )

# =====================
# API Auth (الحماية هنا فقط)
# =====================
from fastapi import Body

@app.post("/api/auth")
async def auth(data: dict = Body(...)):
    init_data = data.get("initData")
    device_id = data.get("device_id")

    if not init_data or not device_id:
        raise HTTPException(400, "Missing data")

    user = verify_init_data(init_data)
    user_id = user["id"]

    users = DEVICE_USERS.get(device_id, set())

    if user_id not in users and len(users) >= MAX_USERS_PER_DEVICE:
        return JSONResponse(
            status_code=403,
            content={"error": "❌ هذا الجهاز مسموح له بحسابين فقط"}
        )

    users.add(user_id)
    DEVICE_USERS[device_id] = users

    return {"status": "ok", "user_id": user_id}

# =====================
# Startup
# =====================
@app.on_event("startup")
def on_startup():
    bot.remove_webhook()
    bot.set_webhook(f"{APP_URL}/webhook")
    print("✅ Webhook connected")

# =====================
# Web App
# =====================
app.mount("/static", StaticFiles(directory=WEBAPP_DIR), name="static")

@app.get("/")
def home():
    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))
