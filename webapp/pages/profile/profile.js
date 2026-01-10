function initProfilePage() {

    // ======================
    // GET USER DATA (Telegram)
    // ======================
    let userId = null;
    let firstName = "";
    let username = "";

    if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
        const user = Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            userId = user.id;
            firstName = user.first_name || "";
            username = user.username ? "@" + user.username : "";
        }
    }

    if (!userId) {
        console.error("❌ لم يتم العثور على user_id");
        return;
    }

    // ======================
    // SHOW USER INFO
    // ======================
    const nameEl = document.getElementById("profileName");
    const usernameEl = document.getElementById("profileUsername");
    const syncEl = document.getElementById("profileSyncStatus");

    if (nameEl) nameEl.textContent = firstName || "مستخدم";
    if (usernameEl) usernameEl.textContent = username || "";
    if (syncEl) syncEl.textContent = "🔄 جاري المزامنة...";

    // ======================
    // LOAD SETTINGS (CACHE FIRST)
    // ======================
    const cachedVibration = localStorage.getItem("vibration");
    const cachedTheme = localStorage.getItem("theme");

    if (cachedVibration !== null && cachedTheme !== null) {
        window.AppSettings.vibration = cachedVibration !== "off";
        window.AppSettings.theme = cachedTheme;

        document.body.classList.toggle("light", cachedTheme === "light");

        initVibration(window.AppSettings.vibration);
        initTheme(window.AppSettings.theme);
    }

    // ======================
    // LOAD SETTINGS FROM API (SYNC)
    // ======================
    fetch(`/api/settings/${userId}`)
        .then(res => res.json())
        .then(settings => {

            window.AppSettings.vibration = !!settings.vibration;
            window.AppSettings.theme = settings.theme || "dark";

            localStorage.setItem(
                "vibration",
                window.AppSettings.vibration ? "on" : "off"
            );
            localStorage.setItem("theme", window.AppSettings.theme);

            document.body.classList.toggle(
                "light",
                window.AppSettings.theme === "light"
            );

            initVibration(window.AppSettings.vibration);
            initTheme(window.AppSettings.theme);

            if (syncEl) syncEl.textContent = "✅ تمّت المزامنة";

        })
        .catch(err => {
            console.error("❌ فشل تحميل الإعدادات من API", err);
            if (syncEl) syncEl.textContent = "⚠️ العمل بوضع محلي";
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
            const newTheme =
                window.AppSettings.theme === "light" ? "dark" : "light";

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
    // LOGOUT (WITH CONFIRM)
    // ======================
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = () => {

            const confirmLogout = confirm("هل أنت متأكد من تسجيل الخروج؟");
            if (!confirmLogout) return;

            localStorage.removeItem("vibration");
            localStorage.removeItem("theme");

            if (window.Telegram && Telegram.WebApp) {
                Telegram.WebApp.close();
            } else {
                location.reload();
            }
        };
    }
}
