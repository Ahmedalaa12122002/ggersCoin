document.addEventListener("DOMContentLoaded", () => {

    const view = document.getElementById("view");
    const buttons = document.querySelectorAll(".nav-btn");
    const title = document.getElementById("page-title");

    if (!view) {
        console.error("❌ عنصر view غير موجود");
        return;
    }

    /* =========================
       DEVICE ID (Protection)
    ========================= */
    function getDeviceId() {
        let deviceId = localStorage.getItem("device_id");
        if (!deviceId) {
            deviceId = "dev-" + crypto.randomUUID();
            localStorage.setItem("device_id", deviceId);
        }
        return deviceId;
    }

    const DEVICE_ID = getDeviceId();

    /* =========================
       GLOBAL SETTINGS
    ========================= */
    window.AppSettings = window.AppSettings || {
        vibration: true,
        theme: "dark"
    };

    /* =========================
       NAVIGATION CONTROL (ANTI SPAM)
    ========================= */
    let navigationLocked = false;
    let currentRequestId = 0;

    function lockNavigation() {
        navigationLocked = true;
        buttons.forEach(btn => btn.style.pointerEvents = "none");
    }

    function unlockNavigation() {
        navigationLocked = false;
        buttons.forEach(btn => btn.style.pointerEvents = "auto");
    }

    /* =========================
       LOAD SETTINGS FROM API
    ========================= */
    async function loadUserSettingsFromAPI() {
        try {
            if (
                !window.Telegram ||
                !Telegram.WebApp ||
                !Telegram.WebApp.initDataUnsafe ||
                !Telegram.WebApp.initDataUnsafe.user
            ) {
                console.warn("⚠️ Telegram user غير متوفر");
                return;
            }

            const userId = Telegram.WebApp.initDataUnsafe.user.id;

            const res = await fetch(`/api/settings/${userId}`, {
                headers: {
                    "X-Init-Data": Telegram.WebApp.initData || "",
                    "X-Device-Id": DEVICE_ID
                }
            });

            if (!res.ok) throw new Error("API error");

            const data = await res.json();

            window.AppSettings.vibration = !!data.vibration;
            window.AppSettings.theme = data.theme || "dark";

            // Cache ذكي
            localStorage.setItem(
                "vibration",
                window.AppSettings.vibration ? "on" : "off"
            );
            localStorage.setItem("theme", window.AppSettings.theme);

            document.body.classList.toggle(
                "light",
                window.AppSettings.theme === "light"
            );

        } catch (err) {
            console.warn("⚠️ فشل تحميل الإعدادات من API – استخدام LocalStorage");

            window.AppSettings.vibration =
                localStorage.getItem("vibration") !== "off";

            window.AppSettings.theme =
                localStorage.getItem("theme") || "dark";

            document.body.classList.toggle(
                "light",
                window.AppSettings.theme === "light"
            );
        }
    }

    // تحميل الإعدادات مرة واحدة عند بدء التطبيق
    loadUserSettingsFromAPI();

    /* =========================
       PAGES CONFIG
    ========================= */
    const pagesConfig = {
        play:    { title: "🎮 Play",    path: "play" },
        tasks:   { title: "📋 المهمات", path: "tasks" },
        ref:     { title: "👥 الإحالة", path: "ref" },
        wallet:  { title: "💰 المحفظة", path: "wallet" },
        vip:     { title: "💎 VIP",     path: "vip" },
        profile: { title: "👤 حسابي",   path: "profile" },
        log:     { title: "🧾 السجل",   path: "log" }
    };

    /* =========================
       LOAD PAGE (SAFE + RACE FIX)
    ========================= */
    async function loadPage(pageKey) {

        if (navigationLocked) return;
        lockNavigation();

        const requestId = ++currentRequestId;
        const page = pagesConfig[pageKey];

        if (!page) {
            unlockNavigation();
            return;
        }

        title.textContent = page.title;

        view.classList.remove("page-show");
        view.classList.add("page-hide");
        view.style.visibility = "hidden";
        view.style.opacity = "0";

        setTimeout(async () => {

            if (requestId !== currentRequestId) return;

            try {
                const res = await fetch(
                    `/static/pages/${page.path}/${page.path}.html`,
                    {
                        headers: {
                            "X-Init-Data": Telegram.WebApp?.initData || "",
                            "X-Device-Id": DEVICE_ID
                        }
                    }
                );

                if (!res.ok) throw new Error("HTML load failed");

                const html = await res.text();
                if (requestId !== currentRequestId) return;

                view.innerHTML = html;

            } catch (e) {
                console.error(e);
                view.innerHTML = "❌ فشل تحميل الصفحة";
                view.style.visibility = "visible";
                view.style.opacity = "1";
                unlockNavigation();
                return;
            }

            /* ===== CSS ===== */
            removeAsset("page-style");
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = `/static/pages/${page.path}/${page.path}.css`;
            css.id = "page-style";

            css.onload = () => {
                if (requestId !== currentRequestId) return;

                view.style.visibility = "visible";
                view.style.opacity = "1";
                view.classList.remove("page-hide");
                view.classList.add("page-show");
            };

            document.head.appendChild(css);

            /* ===== JS ===== */
            removeAsset("page-script");
            const js = document.createElement("script");
            js.src = `/static/pages/${page.path}/${page.path}.js`;
            js.id = "page-script";

            js.onload = () => {
                if (requestId !== currentRequestId) return;

                if (pageKey === "profile" && typeof initProfilePage === "function") {
                    initProfilePage();
                }

                unlockNavigation();
            };

            document.body.appendChild(js);

        }, 200);
    }

    function removeAsset(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    /* =========================
       NAV BUTTONS
    ========================= */
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {

            if (navigationLocked) return;

            const pageKey = btn.dataset.page;
            if (btn.classList.contains("active")) return;

            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (navigator.vibrate && window.AppSettings.vibration) {
                navigator.vibrate(15);
            }

            loadPage(pageKey);
        });
    });

    /* =========================
       DEFAULT PAGE
    ========================= */
    loadPage("play");

});
