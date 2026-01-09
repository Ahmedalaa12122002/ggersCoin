/* ===== Profile Page Logic ===== */

// --------- VIBRATION ----------
const vibBtn = document.getElementById("toggleVibration");

if (vibBtn) {
    const vibEnabled = localStorage.getItem("vibration") !== "off";

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

// --------- THEME ----------
const themeBtn = document.getElementById("toggleTheme");

if (themeBtn) {
    const currentTheme = localStorage.getItem("theme") || "dark";
    themeBtn.textContent = currentTheme === "light" ? "فاتح" : "ليلي";

    themeBtn.addEventListener("click", () => {
        const newTheme = localStorage.getItem("theme") === "light" ? "dark" : "light";

        localStorage.setItem("theme", newTheme);
        window.AppSettings.theme = newTheme;

        document.body.classList.toggle("light", newTheme === "light");
        themeBtn.textContent = newTheme === "light" ? "فاتح" : "ليلي";
    });
}

// --------- LOGOUT ----------
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("vibration");
        localStorage.removeItem("theme");

        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.close();
        } else {
            location.reload();
        }
    });
                              }
