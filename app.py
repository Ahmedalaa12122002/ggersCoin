from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
import telebot
import os, hashlib, hmac, urllib.parse, time

# =====================
# الإعدادات
# =====================
BOT_TOKEN = "8283096353:AAEJhU6xnnZtlzake_gdUM0Zd24-5XepAxw"
APP_URL = "https://web-production-33147.up.railway.app"

bot = telebot.TeleBot(BOT_TOKEN)
app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEBAPP_DIR = os.path.join(BASE_DIR, "webapp")

# =====================
# Telegram initData verify
# =====================
def verify_init_data(init_data: str):
    parsed = dict(urllib.parse.parse_qsl(init_data))
    hash_telegram = parsed.pop("hash", None)

    if not hash_telegram:
        raise HTTPException(status_code=401, detail="Missing hash")

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
        raise HTTPException(status_code=401, detail="Expired auth")

    return True

# =====================
# Telegram webhook
# =====================
@app.post("/webhook")
async def telegram_webhook(request: Request):
    json_data = await request.json()
    update = telebot.types.Update.de_json(json_data)
    bot.process_new_updates([update])
    return {"ok": True}

# =====================
# /start message + button
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
👋 أهلاً بك في تجربة تفاعلية جديدة 🌱

🎮 العب وشارك في مهام ممتعة  
⭐ طوّر مستواك خطوة بخطوة  
🎁 احصل على نقاط ومكافآت داخلية  
📈 تقدّم ونافس الآخرين  

👇 اضغط على الزر وابدأ رحلتك
""",
        reply_markup=kb
    )

# =====================
# Startup: set webhook
# =====================
@app.on_event("startup")
def on_startup():
    bot.remove_webhook()
    bot.set_webhook(f"{APP_URL}/webhook")
    print("✅ Webhook connected")

# =====================
# Web App (محمي)
# =====================
app.mount("/static", StaticFiles(directory=WEBAPP_DIR), name="static")

@app.get("/")
def protected_home(
    request: Request,
    initData: str = Query(None)
):
    user_agent = request.headers.get("user-agent", "").lower()

    # منع المتصفح العادي
    if "telegram" not in user_agent:
        return HTMLResponse(
            "<h2 style='text-align:center;margin-top:50px'>❌ افتح التطبيق من Telegram فقط</h2>",
            status_code=403
        )

    # التحقق من initData
    if not initData:
        return HTMLResponse(
            "<h2 style='text-align:center;margin-top:50px'>❌ صلاحية غير صحيحة</h2>",
            status_code=403
        )

    verify_init_data(initData)

    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))
