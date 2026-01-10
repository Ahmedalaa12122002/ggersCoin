function initProfilePage() {

    // ======================
    // GET USER ID (Telegram)
    // ======================
    let userId = null;
    if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
        userId = Telegram.WebApp.initDataUnsafe.user?.id || null;
    }

    if (!userId) {
        console.error("❌ لم يتم العثور على user_id");
        return;
    }

    // ======================
    // LOAD SETTINGS FROM API
    // ======================
    fetch(`/api/settings/${userId}`)
        .then(res => res.json())
        .then(settings => {

            // تحديث الإعدادات العامة
            window.AppSettings.vibration = !!settings.vibration;
            window.AppSettings.theme = settings.theme || "dark";

            // حفظ محلي (Fallback)
            localStorage.setItem("vibration", window.AppSettings.vibration ? "on" : "off");
            localStorage.setItem("theme", window.AppSettings.theme);

            // تطبيق الثيم
            document.body.classList.toggle("light", window.AppSettings.theme === "light");

            initVibration(window.AppSettings.vibration);
            initTheme(window.AppSettings.theme);

        })
        .catch(err => {
            console.error("❌ فشل تحميل الإعدادات من API", err);

            // Fallback من LocalStorage
            const vib = localStorage.getItem("vibration") !== "off";
            const theme = localStorage.getItem("theme") || "dark";

            window.AppSettings.vibration = vib;
            window.AppSettings.theme = theme;

            document.body.classList.toggle("light", theme === "light");

            initVibration(vib);
            initTheme(theme);
        });

    // ======================
    // VIBRATION
    // ======================
    function initVibration(isEnabled) {
        const vibBtn = document.getElementById("toggleVibration");
        if (!vibBtn) return;

        vibBtn.textContent = isEnabled ? "مفعّل" : "مُعطّل";
        vibBtn.classList.toggle("off", !isEnabled);

        vibBtn.onclick = () => {
            const newState = !window.AppSettings.vibration;

            window.AppSettings.vibration = newState;
            localStorage.setItem("vibration", newState ? "on" : "off");

            vibBtn.textContent = newState ? "مفعّل" : "مُعطّل";
            vibBtn.classList.toggle("off", !newState);

            // اختبار الاهتزاز فورًا
            if (newState && navigator.vibrate) {
                navigator.vibrate(20);
            }

            saveSettings();
        };
    }

    // ======================
    // THEME
    // ======================
    function initTheme(currentTheme) {
        const themeBtn = document.getElementById("toggleTheme");
        if (!themeBtn) return;

        themeBtn.textContent = currentTheme === "light" ? "فاتح" : "ليلي";

        themeBtn.onclick = () => {
            const newTheme = window.AppSettings.theme === "light" ? "dark" : "light";

            window.AppSettings.theme = newTheme;
            localStorage.setItem("theme", newTheme);

            document.body.classList.toggle("light", newTheme === "light");
            themeBtn.textContent = newTheme === "light" ? "فاتح" : "ليلي";

            saveSettings();
        };
    }

    // ======================
    // SAVE SETTINGS TO API
    // ======================
    function saveSettings() {
        fetch(`/api/settings/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                vibration: window.AppSettings.vibration,
                theme: window.AppSettings.theme
            })
        }).catch(err => {
            console.error("❌ فشل حفظ الإعدادات في API", err);
        });
    }

    // ======================
    // LOGOUT
    // ======================
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = () => {

            // لا نحذف الإعدادات من السيرفر
            localStorage.clear();

            if (window.Telegram && Telegram.WebApp) {
                Telegram.WebApp.close();
            } else {
                location.reload();
            }
        };
    }
              }
