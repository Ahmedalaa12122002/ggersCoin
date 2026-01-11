// =====================================
// Telegram WebApp Auth (STRICT MODE)
// =====================================

// ❌ منع التشغيل خارج تيليجرام نهائيًا
if (
    !window.Telegram ||
    !window.Telegram.WebApp ||
    typeof window.Telegram.WebApp.initData !== "string" ||
    window.Telegram.WebApp.initData.length === 0
) {
    document.documentElement.innerHTML = `
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>غير مسموح</title>
        </head>
        <body style="
            margin:0;
            display:flex;
            align-items:center;
            justify-content:center;
            height:100vh;
            background:#000;
            color:#fff;
            font-family:system-ui,sans-serif;
            text-align:center;
        ">
            <div>
                <h2>🚫 غير مسموح</h2>
                <p>يجب فتح التطبيق من داخل تيليجرام فقط</p>
            </div>
        </body>
        </html>
    `;
    throw new Error("Blocked: Not running inside Telegram");
}

const tg = window.Telegram.WebApp;
tg.ready();

// =====================================
// Generate / Get Device ID (ثابت للجهاز)
// =====================================
function getDeviceId() {
    let deviceId = localStorage.getItem("device_id");
    if (!deviceId) {
        deviceId = "dev-" + crypto.randomUUID();
        localStorage.setItem("device_id", deviceId);
    }
    return deviceId;
}

const DEVICE_ID = getDeviceId();

// =====================================
// Get Telegram User
// =====================================
const user = tg.initDataUnsafe?.user;

if (!user || !user.id) {
    document.documentElement.innerHTML = `
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>خطأ</title>
        </head>
        <body style="
            margin:0;
            display:flex;
            align-items:center;
            justify-content:center;
            height:100vh;
            background:#000;
            color:#fff;
            font-family:system-ui,sans-serif;
            text-align:center;
        ">
            <div>
                <h2>⚠️ خطأ</h2>
                <p>فشل التحقق من حساب تيليجرام</p>
            </div>
        </body>
        </html>
    `;
    throw new Error("Telegram user missing");
}

// =====================================
// Prepare Auth Payload
// =====================================
const authUser = {
    id: user.id,
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    username: user.username || "",
    language: user.language_code || "en"
};

// Cache محلي
localStorage.setItem("tg_user", JSON.stringify(authUser));

console.log("✅ Telegram User:", authUser);
console.log("📱 Device ID:", DEVICE_ID);

// =====================================
// Send Auth Request (SECURED)
// =====================================
fetch("/api/auth", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",

        // 🔐 Telegram verification
        "X-Init-Data": tg.initData,

        // 📱 Device protection
        "X-Device-Id": DEVICE_ID
    },
    body: JSON.stringify(authUser)
})
.then(res => res.json())
.then(data => {

    if (data.error) {
        document.documentElement.innerHTML = `
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>تم الحظر</title>
            </head>
            <body style="
                margin:0;
                display:flex;
                align-items:center;
                justify-content:center;
                height:100vh;
                background:#000;
                color:#fff;
                font-family:system-ui,sans-serif;
                text-align:center;
            ">
                <div>
                    <h2>🚫 تم حظر الوصول</h2>
                    <p>${data.error}</p>
                </div>
            </body>
            </html>
        `;
        throw new Error("Auth failed");
    }

    console.log("✅ Auth Success");

})
.catch(err => {
    document.documentElement.innerHTML = `
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>خطأ اتصال</title>
        </head>
        <body style="
            margin:0;
            display:flex;
            align-items:center;
            justify-content:center;
            height:100vh;
            background:#000;
            color:#fff;
            font-family:system-ui,sans-serif;
            text-align:center;
        ">
            <div>
                <h2>⚠️ خطأ اتصال</h2>
                <p>فشل الاتصال بالخادم</p>
            </div>
        </body>
        </html>
    `;
    console.error(err);
});
