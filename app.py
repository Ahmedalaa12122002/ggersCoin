from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
import telebot
import os, time, hashlib, hmac, urllib.parse

from database import (
    init_db,
    get_users_for_device,
    add_user,
    bind_device
)

# =============================
# الإعدادات
# =============================
BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
APP_URL   = "https://web-production-2f18d.up.railway.app"
BOT_NAME  = "GgersCoin Bot"

MAX_USERS_PER_DEVICE = 2

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEBAPP_DIR = os.path.join(BASE_DIR, "webapp")

bot = telebot.TeleBot(BOT_TOKEN, threaded=True)
app = FastAPI()

# =============================
# Telegram initData verify
# =============================
def verify_init_data(init_data: str):
    parsed = dict(urllib.parse.parse_qsl(init_data))
    hash_telegram = parsed.pop("hash", None)

    if not hash_telegram:
        raise HTTPException(status_code=401, detail="No hash")

    data_check = "\n".join(f"{k}={v}" for k, v in sorted(parsed.items()))
    secret_key = hashlib.sha256(BOT_TOKEN.encode()).digest()

    calc_hash = hmac.new(
        secret_key,
        data_check.encode(),
        hashlib.sha256
    ).hexdigest()

    if calc_hash != hash_telegram:
        raise HTTPException(status_code=401, detail="Invalid signature")

    auth_date = int(parsed.get("auth_date", 0))
    if time.time() - auth_date > 86400:
        raise HTTPException(status_code=401, detail="Expired")

    return eval(parsed["user"])

# =============================
# Telegram Webhook ✅ (الحل هنا)
# =============================
@app.post("/webhook")
async def telegram_webhook(req: Request):
    data = await req.json()              # ✅ await صحيح
    update = telebot.types.Update.de_json(data)
    bot.process_new_updates([update])    # ✅ handlers تعمل
    return {"ok": True}

# =============================
# /start (رسالة + زر)
# =============================
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
        """👋 أهلاً بك!

هذا التطبيق عبارة عن لعبة تفاعلية تعتمد على المهام والتقدّم داخل التجربة.

🎮 العب، أنجز المهام، وطوّر مستواك داخل اللعبة.
⭐ احصل على نقاط ومكافآت داخلية حسب نشاطك.

👇 للدخول إلى التطبيق وبدء التجربة،
اضغط على الزر بالأسفل.
""",
        reply_markup=kb
    )

# =============================
# Auth + Device limit (DB)
# =============================
@app.post("/api/auth")
async def auth(data: dict):
    init_data = data.get("initData")
    device_id = data.get("device_id")

    if not init_data or not device_id:
        raise HTTPException(status_code=400, detail="Missing data")

    user = verify_init_data(init_data)
    user_id = user["id"]
    username = user.get("username")

    users = get_users_for_device(device_id)

    if user_id not in users and len(users) >= MAX_USERS_PER_DEVICE:
        return JSONResponse(
            status_code=403,
            content={"error": "❌ هذا الجهاز وصل للحد الأقصى (2 حساب فقط)"}
        )

    add_user(user_id, username)
    bind_device(device_id, user_id)

    return {
        "status": "ok",
        "user_id": user_id,
        "username": username
    }

# =============================
# Startup
# =============================
@app.on_event("startup")
async def on_startup():
    init_db()
    try:
        bot.delete_webhook(drop_pending_updates=True)
        bot.set_webhook(url=f"{APP_URL}/webhook")
        print("✅ Webhook set successfully")
    except Exception as e:
        print("⚠️ Webhook setup skipped:", e)

# =============================
# WebApp (حماية من المتصفح)
# =============================
app.mount("/static", StaticFiles(directory=WEBAPP_DIR), name="static")

@app.get("/")
def protected_home(request: Request, initData: str = Query(None)):
    ua = request.headers.get("user-agent", "").lower()
    if "telegram" not in ua:
        return HTMLResponse(
            "<h2 style='text-align:center;margin-top:50px'>❌ افتح التطبيق من Telegram فقط</h2>",
            status_code=403
        )

    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))
