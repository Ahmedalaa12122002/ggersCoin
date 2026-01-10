// =====================================
// Telegram WebApp Auth
// =====================================
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

if (!user) {
    console.warn("⚠️ Telegram user not found");
} else {

    const authUser = {
        id: user.id,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        username: user.username || "",
        language: user.language_code || "en"
    };

    // حفظ بيانات المستخدم محليًا (Cache)
    localStorage.setItem("tg_user", JSON.stringify(authUser));

    console.log("✅ Telegram User:", authUser);
    console.log("📱 Device ID:", DEVICE_ID);

    // =====================================
    // Send Auth Request (Protected)
    // =====================================
    fetch("/api/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",

            // 🔐 Telegram Security
            "X-Init-Data": tg.initData,

            // 📱 Device Protection
            "X-Device-Id": DEVICE_ID
        },
        body: JSON.stringify(authUser)
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            console.error("❌ Auth Error:", data.error);
        } else {
            console.log("✅ Auth Success");
        }
    })
    .catch(err => {
        console.error("❌ Auth Request Failed:", err);
    });
}
