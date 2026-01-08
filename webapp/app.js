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

    // تحميل صفحة
    async function loadPage(pageKey) {
        const page = pagesConfig[pageKey];
        if (!page) return;

        // العنوان
        title.textContent = page.title;

        // تحميل HTML
        view.innerHTML = "⏳ جاري التحميل...";
        try {
            const res = await fetch(`/static/pages/${page.path}/${page.path}.html`);
            view.innerHTML = await res.text();
        } catch (e) {
            view.innerHTML = "❌ فشل تحميل الصفحة";
            console.error(e);
            return;
        }

        // تحميل CSS
        removeAsset("page-style");
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = `/static/pages/${page.path}/${page.path}.css`;
        css.id = "page-style";
        document.head.appendChild(css);

        // تحميل JS
        removeAsset("page-script");
        const js = document.createElement("script");
        js.src = `/static/pages/${page.path}/${page.path}.js`;
        js.id = "page-script";
        js.defer = true;
        document.body.appendChild(js);
    }

    function removeAsset(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // ربط الأزرار
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const pageKey = btn.dataset.page;

            // تفعيل الزر
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // تحميل الصفحة
            loadPage(pageKey);
        });
    });

    // تحميل Play افتراضيًا
    loadPage("play");

});
