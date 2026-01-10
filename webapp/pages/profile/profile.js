function initProfilePage() {

    /* ===== Vibration ===== */
    const vibBtn = document.getElementById("toggleVibration");
    if (vibBtn) {
        const vibEnabled = localStorage.getItem("vibration") !== "off";
        vibBtn.textContent = vibEnabled ? "مفعّل" : "مُعطّل";
        vibBtn.classList.toggle("off", !vibEnabled);

        vibBtn.onclick = () => {
            const enabled = localStorage.getItem("vibration") !== "off";
            if (enabled) {
                localStorage.setItem("vibration", "off");
                window.AppSettings.vibration = false;
                vibBtn.textContent = "مُعطّل";
                vibBtn.classList.add("off");
            } else {
                localStorage.setItem("vibration", "on");
                window.AppSettings.vibration = true;
                vibBtn.textContent = "مفعّل";
                vibBtn.classList.remove("off");
            }
        };
    }

    /* ===== Theme ===== */
    const themeBtn = document.getElementById("toggleTheme");
    if (themeBtn) {
        const theme = localStorage.getItem("theme") || "dark";
        themeBtn.textContent = theme === "light" ? "فاتح" : "ليلي";

        themeBtn.onclick = () => {
            const newTheme = localStorage.getItem("theme") === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            window.AppSettings.theme = newTheme;
            document.body.classList.toggle("light", newTheme === "light");
            themeBtn.textContent = newTheme === "light" ? "فاتح" : "ليلي";
        };
    }

    /* ===== Logout ===== */
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.clear();
            if (window.Telegram?.WebApp) {
                Telegram.WebApp.close();
            } else {
                location.reload();
            }
        };
    }
            }
