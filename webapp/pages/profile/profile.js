document.addEventListener("DOMContentLoaded", () => {

    /* ===== Vibration ===== */
    const vibBtn = document.getElementById("toggleVibration");
    const vibEnabled = localStorage.getItem("vibration") !== "off";

    if (vibBtn) {
        vibBtn.textContent = vibEnabled ? "مفعّل" : "مُعطّل";
        vibBtn.classList.toggle("off", !vibEnabled);

        vibBtn.addEventListener("click", () => {
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
        });
    }

    /* ===== Theme ===== */
    const themeBtn = document.getElementById("toggleTheme");
    const currentTheme = localStorage.getItem("theme") || "dark";

    if (themeBtn) {
        themeBtn.textContent = currentTheme === "light" ? "فاتح" : "ليلي";

        themeBtn.addEventListener("click", () => {
            const theme = localStorage.getItem("theme") === "light" ? "dark" : "light";
            localStorage.setItem("theme", theme);
            window.AppSettings.theme = theme;

            document.body.classList.toggle("light", theme === "light");
            themeBtn.textContent = theme === "light" ? "فاتح" : "ليلي";
        });
    }

});
