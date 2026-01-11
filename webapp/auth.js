// =====================================
// Telegram WebApp Auth (STRICT MODE)
// =====================================

// ❌ منع التشغيل خارج تيليجرام نهائيًا
if (
    !window.Telegram ||
    !Telegram.WebApp ||
    typeof Telegram.WebApp.initData !== "string" ||
    Telegram.WebApp.initData.length === 0
) {
    document.body.innerHTML = `
        <div style="
            display:flex;
            align-items:center;
            justify-content:center;
            height:100vh;
            background:#000;
            color:#fff;
            font-family:sans-serif;
            text-align:center;
            padding:20px;
        ">
            <div>
                <h2>🚫 غير مسموح</h2>
                <p>يجب فتح التطبيق من داخل تيليجرام فقط</p>
            </div>
        </div>
    `;
    throw new Error("Blocked: Not running inside Telegram");
}

const tg = Telegram.WebApp;
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
    console.error("❌ Telegram user not found");
    document.body.innerHTML = `
        <div style="
            display:flex;
            align-items:center;
            justify-content:center;
            height:100vh;
            background:#000;
            color:#fff;
            font-family:sans-serif;
            text-align:center;
            padding:20px;
        ">
            <div>
                <h2>⚠️ خطأ</h2>
                <p>فشل التحقق من حساب تيليجرام</p>
            </div>
        </div>
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
        console.error("❌ Auth Error:", data.error);

        document.body.innerHTML = `
            <div style="
                display:flex;
                align-items:center;
                justify-content:center;
                height:100vh;
                background:#000;
                color:#fff;
                font-family:sans-serif;
                text-align:center;
                padding:20px;
            ">
                <div>
                    <h2>🚫 تم حظر الوصول</h2>
                    <p>${data.error}</p>
                </div>
            </div>
        `;

        throw new Error("Auth failed");
    }

    console.log("✅ Auth Success");

})
.catch(err => {
    console.error("❌ Auth Request Failed:", err);

    document.body.innerHTML = `
        <div style="
            display:flex;
            align-items:center;
            justify-content:center;
            height:100vh;
            background:#000;
            color:#fff;
            font-family:sans-serif;
            text-align:center;
            padding:20px;
        ">
            <div>
                <h2>⚠️ خطأ اتصال</h2>
                <p>فشل الاتصال بالخادم</p>
            </div>
        </div>
    `;
});
