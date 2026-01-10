document.addEventListener("DOMContentLoaded", () => {

    const view = document.getElementById("view");
    const buttons = document.querySelectorAll(".nav-btn");
    const title = document.getElementById("page-title");

    if (!view) {
        console.error("❌ عنصر view غير موجود");
        return;
    }

    let isLoading = false; // 🔥 منع الضغط المتكرر

    /* =========================
       GLOBAL SETTINGS (API)
    ========================= */
    window.AppSettings = {
        vibration: true,
        theme: "dark"
    };

    async function loadUserSettingsFromAPI() {
        try {
            if (!window.Telegram || !Telegram.WebApp || !Telegram.WebApp.initDataUnsafe?.user) {
                console.warn("⚠️ Telegram user غير متوفر");
                return;
            }

            const userId = Telegram.WebApp.initDataUnsafe.user.id;
            const res = await fetch(`/api/settings/${userId}`);
            if (!res.ok) throw new Error("API error");

            const data = await res.json();

            window.AppSettings.vibration = data.vibration;
            window.AppSettings.theme = data.theme;

            document.body.classList.toggle("light", data.theme === "light");

        } catch (err) {
            console.warn("⚠️ فشل تحميل الإعدادات من API – استخدام localStorage");

            window.AppSettings.vibration = localStorage.getItem("vibration") !== "off";
            window.AppSettings.theme = localStorage.getItem("theme") || "dark";

            document.body.classList.toggle(
                "light",
                window.AppSettings.theme === "light"
            );
        }
    }

    // تحميل الإعدادات مرة واحدة عند بدء التطبيق
    loadUserSettingsFromAPI();

    const pagesConfig = {
        play: {
            title: "🎮 Play",
            path: "play"
        },
        tasks: {
            title: "📋 المهمات",
            path: "tasks"
        },
        ref: {
            title: "👥 الإحالة",
            path: "ref"
        },
        wallet: {
            title: "💰 المحفظة",
            path: "wallet"
        },
        vip: {
            title: "💎 VIP",
            path: "vip"
        },
        profile: {
            title: "👤 حسابي",
            path: "profile"
        },
        log: {
            title: "🧾 السجل",
            path: "log"
        }
    };

    // =========================
    // تحميل صفحة (حل FOUC + الوميض)
    // =========================
    async function loadPage(pageKey) {
        if (isLoading) return;
        isLoading = true;

        const page = pagesConfig[pageKey];
        if (!page) {
            isLoading = false;
            return;
        }

        title.textContent = page.title;

        view.classList.remove("page-show");
        view.classList.add("page-hide");
        view.style.visibility = "hidden";
        view.style.opacity = "0";

        setTimeout(async () => {

            try {
                const res = await fetch(`/static/pages/${page.path}/${page.path}.html`);
                view.innerHTML = await res.text();
            } catch (e) {
                view.innerHTML = "❌ فشل تحميل الصفحة";
                console.error(e);
                view.style.opacity = "1";
                view.style.visibility = "visible";
                isLoading = false;
                return;
            }

            removeAsset("page-style");
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = `/static/pages/${page.path}/${page.path}.css`;
            css.id = "page-style";

            css.onload = () => {
                requestAnimationFrame(() => {
                    view.style.visibility = "visible";
                    view.style.opacity = "1";
                    view.classList.remove("page-hide");
                    view.classList.add("page-show");
                });
            };

            document.head.appendChild(css);

            removeAsset("page-script");
            const js = document.createElement("script");
            js.src = `/static/pages/${page.path}/${page.path}.js`;
            js.id = "page-script";

            js.onload = () => {
                if (pageKey === "profile" && typeof initProfilePage === "function") {
                    initProfilePage();
                }
                isLoading = false;
            };

            document.body.appendChild(js);

        }, 200);
    }

    function removeAsset(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // =========================
    // ربط أزرار القوائم
    // =========================
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const pageKey = btn.dataset.page;

            if (btn.classList.contains("active")) return;

            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            loadPage(pageKey);

            // اهتزاز (لو مفعّل)
            if (navigator.vibrate && window.AppSettings.vibration) {
                navigator.vibrate(15);
            }
        });
    });

    // =========================
    // تحميل Play افتراضيًا
    // =========================
    loadPage("play");

});
