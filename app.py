from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import telebot
import os

BOT_TOKEN = "8283096353:AAEJhU6xnnZtlzake_gdUM0Zd24-5XepAxw"
APP_URL = "https://web-production-33147.up.railway.app"

bot = telebot.TeleBot(BOT_TOKEN)
app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEBAPP_DIR = os.path.join(BASE_DIR, "webapp")

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
# /start message + button (رسالة جذابة وآمنة)
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
📈 تقدّم، استكشف، ونافس الآخرين  

👇 اضغط على الزر بالأسفل وابدأ رحلتك
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
# Web App
# =====================
app.mount("/static", StaticFiles(directory=WEBAPP_DIR), name="static")

@app.get("/")
def home():
    return FileResponse(os.path.join(WEBAPP_DIR, "index.html"))
