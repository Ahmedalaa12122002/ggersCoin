const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// ====== ENV ======
const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = process.env.APP_URL;
const PORT = process.env.PORT || 3000;

// ====== BOT ======
const bot = new TelegramBot(BOT_TOKEN, { webHook: true });

// ====== MIDDLEWARE ======
app.use(bodyParser.json());
app.use("/static", express.static(path.join(__dirname, "webapp")));

// ====== WEBHOOK ======
app.post(`/bot${BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// ====== START MESSAGE ======
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`👋 أهلاً بك في تجربة تفاعلية جديدة 🌱

🎮 العب وشارك في مهام ممتعة  
⭐ طوّر مستواك خطوة بخطوة  
🎁 احصل على نقاط ومكافآت داخلية  

👇 اضغط الزر وابدأ الآن`,
  {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "🚀 دخول التطبيق",
          web_app: { url: APP_URL }
        }
      ]]
    }
  });
});

// ====== WEBAPP ======
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "webapp", "index.html"));
});

// ====== LISTEN (ده أهم سطر) ======
app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});

// ====== SET WEBHOOK ======
bot.setWebHook(`${APP_URL}/bot${BOT_TOKEN}`)
  .then(() => console.log("✅ Webhook connected"))
  .catch(err => console.error("Webhook error:", err));
