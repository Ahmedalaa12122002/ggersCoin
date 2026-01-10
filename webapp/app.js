document.addEventListener("DOMContentLoaded", () => {

    const view = document.getElementById("view");
    const buttons = document.querySelectorAll(".nav-btn");
    const title = document.getElementById("page-title");

    if (!view) {
        console.error("❌ عنصر view غير موجود");
        return;
    }

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
    // تحميل صفحة (منع الوميض)
    // =========================
    async function loadPage(pageKey) {
        const page = pagesConfig[pageKey];
        if (!page) return;

        title.textContent = page.title;

        // إخفاء آمن بدون كسر
        view.classList.remove("page-show");
        view.classList.add("page-hide");

        setTimeout(async () => {

            try {
                const res = await fetch(`/static/pages/${page.path}/${page.path}.html`);
                view.innerHTML = await res.text();
            } catch (e) {
                view.innerHTML = "❌ فشل تحميل الصفحة";
                console.error(e);
                return;
            }

            // تحميل CSS أولاً
            removeAsset("page-style");
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = `/static/pages/${page.path}/${page.path}.css`;
            css.id = "page-style";

            css.onload = () => {
                // إظهار الصفحة بعد اكتمال الستايل
                view.classList.remove("page-hide");
                view.classList.add("page-show");
            };

            document.head.appendChild(css);

            // تحميل JS
            removeAsset("page-script");
            const js = document.createElement("script");
            js.src = `/static/pages/${page.path}/${page.path}.js`;
            js.id = "page-script";
            document.body.appendChild(js);

        }, 160);
    }

    function removeAsset(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // =========================
    // أزرار القوائم
    // =========================
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const pageKey = btn.dataset.page;

            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            loadPage(pageKey);
        });
    });

    // =========================
    // تحميل Play افتراضيًا
    // =========================
    loadPage("play");

});
