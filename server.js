import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = process.env.APP_URL;

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Webhook endpoint
app.post("/webhook", async (req, res) => {
  const update = req.body;

  if (update.message?.text === "/start") {
    const chatId = update.message.chat.id;

    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "👋 أهلاً بك\n\nاضغط الزر للدخول إلى التطبيق",
        reply_markup: {
          inline_keyboard: [[
            {
              text: "🚀 دخول التطبيق",
              web_app: { url: APP_URL }
            }
          ]]
        }
      })
    });
  }

  res.send("ok");
});

// Web App
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="background:#111;color:#0f0;text-align:center">
        <h1>WebApp Works ✅</h1>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        <script>
          if (!window.Telegram.WebApp.initDataUnsafe.user) {
            document.body.innerHTML = "❌ افتح من داخل Telegram فقط";
          }
        </script>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log("Server running on port", PORT);

  // Set webhook
  await fetch(`${TELEGRAM_API}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: `${APP_URL}/webhook`
    })
  });

  console.log("Webhook connected");
});
