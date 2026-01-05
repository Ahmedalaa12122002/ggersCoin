// bot/bot.js

const TelegramBot = require('node-telegram-bot-api');
const { mainKeyboard } = require('./keyboards');

// ==============================
// ⚙️ إعدادات البوت
// ==============================

const BOT_TOKEN = "8440388547:AAF8Ftiu7Qmi1GLfHzViIRAzgZE7khvvXC8";
const WEB_APP_URL = "https://ggerscoin-production.up.railway.app/";

// ==============================
// 🚀 تشغيل البوت
// ==============================

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ==============================
// 📩 رسالة /start
// ==============================

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || "صديقنا";

  const welcomeMessage = `
🐝 *مرحبًا بك في WinHive*  

يا ${firstName} 👋  
ابدأ الآن رحلتك في الربح من:
🌾 لعبة المزرعة  
📋 تنفيذ المهام  
💰 جمع النقاط  

اضغط على الزر بالأسفل للدخول إلى التطبيق 👇
`;

  bot.sendMessage(chatId, welcomeMessage, {
    parse_mode: "Markdown",
    ...mainKeyboard(WEB_APP_URL)
  });
});

// ==============================
// 🔔 تأكيد التشغيل
// ==============================

console.log("✅ WinHive Bot is running...");
