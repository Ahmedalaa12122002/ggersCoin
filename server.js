const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = process.env.APP_URL;

const app = express();
const PORT = process.env.PORT || 3000;

// 👇 ده المهم
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "index.html"));
});

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 أهلاً بك\n\nاضغط الزر للدخول 👇",
    {
      reply_markup: {
        inline_keyboard: [[
          { text: "🚀 دخول الويب", url: APP_URL }
        ]]
      }
    }
  );
});

app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});
