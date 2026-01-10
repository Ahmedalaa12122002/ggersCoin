document.addEventListener("DOMContentLoaded", () => {

    const view = document.getElementById("view");
    const buttons = document.querySelectorAll(".nav-btn");
    const title = document.getElementById("page-title");

    if (!view) {
        console.error("❌ عنصر view غير موجود");
        return;
    }

    let isLoading = false; // 🔥 منع الضغط المتكرر

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
        if (isLoading) return; // 🔒 قفل مؤقت
        isLoading = true;

        const page = pagesConfig[pageKey];
        if (!page) {
            isLoading = false;
            return;
        }

        // العنوان (حتى لو مخفي)
        title.textContent = page.title;

        // إخفاء المحتوى تمامًا قبل أي تغيير
        view.classList.remove("page-show");
        view.classList.add("page-hide");
        view.style.visibility = "hidden";
        view.style.opacity = "0";

        setTimeout(async () => {

            // تحميل HTML
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

            // تحميل CSS أولًا (مهم جدًا)
            removeAsset("page-style");
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = `/static/pages/${page.path}/${page.path}.css`;
            css.id = "page-style";

            css.onload = () => {
                // إظهار المحتوى بعد جاهزية CSS
                requestAnimationFrame(() => {
                    view.style.visibility = "visible";
                    view.style.opacity = "1";
                    view.classList.remove("page-hide");
                    view.classList.add("page-show");
                });
            };

            document.head.appendChild(css);

            // تحميل JS
            removeAsset("page-script");
            const js = document.createElement("script");
            js.src = `/static/pages/${page.path}/${page.path}.js`;
            js.id = "page-script";

            js.onload = () => {
                // 🔥 إعادة تهيئة صفحة حسابي
                if (pageKey === "profile" && typeof initProfilePage === "function") {
                    initProfilePage();
                }
                isLoading = false; // 🔓 فك القفل
            };

            document.body.appendChild(js);

        }, 200); // زمن الانتقال المحسوب
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

            // منع إعادة تحميل نفس الصفحة
            if (btn.classList.contains("active")) return;

            // تفعيل الزر
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // تحميل الصفحة
            loadPage(pageKey);
        });
    });

    // =========================
    // تحميل Play افتراضيًا (مرة واحدة)
    // =========================
    loadPage("play");

});
