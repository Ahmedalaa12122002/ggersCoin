// =====================================
// Telegram WebApp Auth (SAFE + STRICT)
// =====================================

// =====================================
// Helper: Show Block Message (بدون كسر)
// =====================================
function showBlockMessage(title, message) {
    document.body.innerHTML = `
        <div style="
            margin:0;
            display:flex;
            align-items:center;
            justify-content:center;
            height:100vh;
            background:#000;
            color:#fff;
            font-family:system-ui,sans-serif;
            text-align:center;
            padding:20px;
        ">
            <div>
                <h2>${title}</h2>
                <p>${message}</p>
            </div>
        </div>
    `;
}

// =====================================
// Helper: Wait for Telegram initData (🔥 الحل النهائي)
// =====================================
function waitForTelegramInit() {
    return new Promise(resolve => {
        if (
            window.Telegram &&
            Telegram.WebApp &&
            typeof Telegram.WebApp.initData === "string" &&
            Telegram.WebApp.initData.length > 0
        ) {
            resolve();
        } else {
            const interval = setInterval(() => {
                if (
                    window.Telegram &&
                    Telegram.WebApp &&
                    typeof Telegram.WebApp.initData === "string" &&
                    Telegram.WebApp.initData.length > 0
                ) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50);
        }
    });
}

// =====================================
// Telegram Availability Check (بدون كسر WebView)
// =====================================
if (
    !window.Telegram ||
    !window.Telegram.WebApp
) {
    showBlockMessage(
        "🚫 غير مسموح",
        "يجب فتح التطبيق من داخل تيليجرام فقط"
    );
    console.warn("Blocked: Not running inside Telegram");
} else {

    (async function () {

        // ⏳ انتظر Telegram يجهّز initData
        await waitForTelegramInit();

        const tg = Telegram.WebApp;

        tg.ready();
        tg.expand();

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
            showBlockMessage(
                "⚠️ خطأ",
                "فشل التحقق من حساب تيليجرام"
            );
            console.error("Telegram user missing");
            return;
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
        console.log("🔐 initData length:", tg.initData.length);

        // =====================================
        // Send Auth Request (SECURED + SAFE)
        // =====================================
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                    // 🔐 Telegram verification
                    "X-Init-Data": tg.initData,

                    // 📱 Device protection
                    "X-Device-Id": DEVICE_ID
                },
                body: JSON.stringify(authUser)
            });

            let data = {};
            try {
                data = await res.json();
            } catch (e) {}

            if (!res.ok || data.error) {
                console.warn("Auth failed:", data.error || res.status);
                showBlockMessage(
                    "⚠️ تنبيه",
                    data.error || "تعذر التحقق من الحساب"
                );
                return;
            }

            console.log("✅ Auth Success – App continues normally");

        } catch (err) {
            console.error("Auth request error:", err);
            showBlockMessage(
                "⚠️ خطأ اتصال",
                "تعذر الاتصال بالخادم، تأكد من الإنترنت"
            );
        }

    })();
        }
