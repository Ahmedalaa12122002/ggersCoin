const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

// ====== VARIABLES ======
const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = process.env.APP_URL;

// ====== EXPRESS ======
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("web"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "index.html"));
});

// ====== TELEGRAM BOT ======
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
    "👋 أهلاً بك\n\nاضغط الزر للدخول 👇",
    {
      reply_markup: {
        inline_keyboard: [[
          {
            text: "🚀 دخول الويب",
            url: APP_URL
          }
        ]]
      }
    }
  );
});

// ====== START SERVER ======
app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});
