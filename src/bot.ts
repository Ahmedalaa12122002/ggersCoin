import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import express from "express";

// التوكن الخاص بك
const BOT_TOKEN = "8283096353:AAEJhU6xnnZtlzake_gdUM0Zd24-5XepAxw";
// الرابط الصحيح (تأكد من عدم وجود / في النهاية هنا)
const APP_URL = "https://ggerscoin-production.up.railway.app";

const bot = new Bot(BOT_TOKEN);

// رسالة الترحيب
bot.command("start", async (ctx) => {
    const welcomeMsg = `🚀 أهلاً بك في تطبيق الأرباح!\n\nاضغط على الزر أدناه للبدء:`;
    const keyboard = new InlineKeyboard()
        .webApp("🎮 فتح التطبيق", `${APP_URL}/`)
        .row()
        .url("📢 القناة", "https://t.me/telegram");

    await ctx.reply(welcomeMsg, { reply_markup: keyboard });
});

const app = express();
app.use(express.json());
app.use(express.static("public"));

// تصحيح مسار الويب هوك بإضافة / قبل الكلمة
app.use("/webhook", webhookCallback(bot, "express"));

// Railway يستخدم متغير PORT تلقائياً، سنجعله يختار 3000 كافتراضي
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`السيرفر يعمل الآن على المنفذ: ${PORT}`);
    try {
        // إضافة /webhook بشكل صحيح للرابط
        await bot.api.setWebhook(`${APP_URL}/webhook`);
        console.log("✅ تم ربط الويب هوك بنجاح!");
    } catch (e) {
        console.error("❌ خطأ في الويب هوك:", e);
    }
});
