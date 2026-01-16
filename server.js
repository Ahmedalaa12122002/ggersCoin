const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");
const crypto = require("crypto");
const path = require("path");

// ==================
// الإعدادات
// ==================
const BOT_TOKEN = "8283096353:AAEJhU6xnnZtlzake_gdUM0Zd24-5XepAxw";
const APP_URL = "https://ggerscoin-production.up.railway.app";

const app = express();
const bot = new TelegramBot(BOT_TOKEN);

// ==================
// Middleware
// ==================
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "webapp")));

// ==================
// Webhook
// ==================
app.post(`/webhook`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// ==================
// رسالة /start + زر WebApp
// ==================
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🌱 أهلاً بك في تجربة تفاعلية ممتعة

🎮 العب وشارك في مهام داخل اللعبة  
⭐ طوّر مستواك واكتشف مزايا جديدة  
🎁 احصل على نقاط ومكافآت داخلية  

👇 اضغط على الزر وابدأ الآن`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 دخول التطبيق",
              web_app: { url: APP_URL }
            }
          ]
        ]
      }
    }
  );
});

// ==================
// الصفحة الرئيسية (WebApp)
// ==================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "webapp", "index.html"));
});

// ==================
// تشغيل السيرفر + Webhook
// ==================
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log("✅ Server running on port", PORT);
  await bot.setWebHook(`${APP_URL}/webhook`);
  console.log("✅ Webhook connected");
});
