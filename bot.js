const TelegramBot = require("node-telegram-bot-api");

// ===== إعدادات =====
const BOT_TOKEN = "8440388547:AAF8Ftiu7Qmi1GLfHzViIRAzgZE7khvvXC8";
const WEB_APP_URL = "https://ggerscoin-production.up.railway.app/";

// ===== تشغيل البوت =====
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ===== رسالة /start =====
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🐝 مرحبًا بك في WinHive\n\nاضغط على الزر للدخول إلى التطبيق 👇",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🐝 دخول تطبيق WinHive",
              web_app: {
                url: WEB_APP_URL
              }
            }
          ]
        ]
      }
    }
  );
});

console.log("✅ WinHive Bot Running");
