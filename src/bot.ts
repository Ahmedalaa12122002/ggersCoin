import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import express from "express";

// معلوماتك التي أرسلتها
const BOT_TOKEN = "8283096353:AAEJhU6xnnZtlzake_gdUM0Zd24-5XepAxw";
const APP_URL = "https://ggerscoin-production.up.railway.app";

const bot = new Bot(BOT_TOKEN);

// رسالة الترحيب
bot.command("start", async (ctx) => {
    const welcomeMsg = `
🚀 **أهلاً بك في منصة الربح الكبرى!**

هنا يمكنك البدء في كسب المكافآت وتطوير حسابك. 
نظامنا محمي بالكامل ويضمن لك استقرار الأرباح.

👇 **اضغط على الزر للدخول للتطبيق:**`;

    const keyboard = new InlineKeyboard()
        .webApp("🎮 فتح تطبيق الويب", APP_URL)
        .row()
        .url("📢 تابع آخر الأخبار", "https://t.me/telegram");

    await ctx.reply(welcomeMsg, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
    });
});

const app = express();
app.use(express.json());
app.use(express.static("public"));

// تشغيل الويب هوك للاستقرار في Railway
app.use("/webhook", webhookCallback(bot, "express"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    // سيقوم Railway تلقائياً بضبط الويب هوك إذا كان الرابط مفعلاً
    try {
        await bot.api.setWebhook(`${APP_URL}webhook`);
        console.log("Webhook has been set successfully!");
    } catch (e) {
        console.error("Error setting webhook:", e);
    }
});

