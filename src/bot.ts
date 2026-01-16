import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import express from "express";

// إعداداتك الخاصة
const BOT_TOKEN = "8283096353:AAEJhU6xnnZtlzake_gdUM0Zd24-5XepAxw";
const APP_URL = "https://ggerscoin-production.up.railway.app"; // تأكد من عدم وجود / في النهاية هنا

const bot = new Bot(BOT_TOKEN);

// 1. رسالة ترحيب عند الضغط على Start
bot.command("start", async (ctx) => {
    const user = ctx.from?.first_name || "بطل";
    const welcomeMsg = `
🚀 **أهلاً بك يا ${user} في تطبيق الأرباح!**

منصتنا الآن تعمل بكفاءة على سيرفرات Railway. 
يمكنك البدء الآن عبر فتح تطبيق الويب بالأسفل.

👇 **اضغط هنا للدخول:**`;

    const keyboard = new InlineKeyboard()
        .webApp("🎮 فتح تطبيق الويب", `${APP_URL}/`)
        .row()
        .url("📢 قناة التحديثات", "https://t.me/telegram");

    await ctx.reply(welcomeMsg, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
    });
});

// 2. رد تلقائي على أي رسالة للتجربة (للتأكد أن البوت يعمل)
bot.on("message", async (ctx) => {
    await ctx.reply("وصلت رسالتك! البوت يعمل بنجاح. استخدم /start لفتح تطبيق الويب.");
});

const app = express();
app.use(express.json());

// تشغيل ملفات الويب من مجلد public
app.use(express.static("public"));

// مسار الويب هوك (هذا هو الرابط الذي سيتحدث معه تيليجرام)
app.use("/webhook", webhookCallback(bot, "express"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`السيرفر يعمل الآن على منفذ: ${PORT}`);
    
    // ضبط الويب هوك يدوياً عند بدء التشغيل لضمان الربط
    try {
        await bot.api.setWebhook(`${APP_URL}/webhook`);
        console.log("✅ تم ربط الويب هوك بتيليجرام بنجاح!");
    } catch (e) {
        console.error("❌ فشل ربط الويب هوك:", e);
    }
});
