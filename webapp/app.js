document.addEventListener("DOMContentLoaded", () => {

    const view = document.getElementById("view");
    const buttons = document.querySelectorAll(".nav-btn");
    const title = document.getElementById("page-title");

    const pagesConfig = {
        play: { title: "🎮 Play", path: "play" },
        tasks: { title: "📋 المهمات", path: "tasks" },
        ref: { title: "👥 الإحالة", path: "ref" },
        wallet: { title: "💰 المحفظة", path: "wallet" },
        vip: { title: "💎 VIP", path: "vip" },
        profile: { title: "👤 حسابي", path: "profile" },
        log: { title: "🧾 السجل", path: "log" }
    };

    async function loadPage(pageKey) {
        const page = pagesConfig[pageKey];
        if (!page) return;

        title.textContent = page.title;

        view.classList.remove("page-show");
        view.classList.add("page-hide");

        setTimeout(async () => {
            try {
                const res = await fetch(`/static/pages/${page.path}/${page.path}.html`);
                view.innerHTML = await res.text();
            } catch {
                view.innerHTML = "❌ فشل تحميل الصفحة";
                return;
            }

            view.classList.remove("page-hide");
            view.classList.add("page-show");

            // CSS
            removeAsset("page-style");
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = `/static/pages/${page.path}/${page.path}.css`;
            css.id = "page-style";
            document.head.appendChild(css);

            // JS
            removeAsset("page-script");
            const js = document.createElement("script");
            js.src = `/static/pages/${page.path}/${page.path}.js`;
            js.id = "page-script";
            js.onload = () => {
                if (pageKey === "profile" && typeof initProfilePage === "function") {
                    initProfilePage();
                }
            };
            document.body.appendChild(js);

        }, 180);
    }

    function removeAsset(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    buttons.forEach(btn => {
        btn.onclick = () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            loadPage(btn.dataset.page);
        };
    });

    loadPage("play");
});
