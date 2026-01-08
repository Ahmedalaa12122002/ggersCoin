const view = document.getElementById("view");
const buttons = document.querySelectorAll(".nav-btn");
const title = document.getElementById("page-title");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        setActive(btn);
        loadPage(btn.dataset.page);
    });
});

function setActive(activeBtn) {
    buttons.forEach(b => b.classList.remove("active"));
    activeBtn.classList.add("active");
}

async function loadPage(page) {
    title.innerText = activeTitle(page);
    view.innerHTML = "⏳ جاري التحميل...";

    try {
        const res = await fetch(`/static/pages/${page}/${page}.html`);
        view.innerHTML = await res.text();
        loadAssets(page);
    } catch {
        view.innerHTML = "⚠️ الصفحة غير متاحة";
    }
}

function loadAssets(page) {
    removeOld("page-style");
    removeOld("page-script");

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `/static/pages/${page}/${page}.css`;
    css.id = "page-style";
    document.head.appendChild(css);

    const js = document.createElement("script");
    js.src = `/static/pages/${page}/${page}.js`;
    js.id = "page-script";
    document.body.appendChild(js);
}

function removeOld(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function activeTitle(page) {
    return {
        play: "🎮 Play",
        tasks: "📋 المهمات",
        ref: "👥 الإحالة",
        wallet: "💰 المحفظة",
        vip: "💎 VIP",
        profile: "👤 حسابي",
        log: "🧾 سجل المعلومات"
    }[page] || "GgersCoin";
}

/* Default */
loadPage("play");
// تحميل المزرعة افتراضيًا
loadPage("farm");
