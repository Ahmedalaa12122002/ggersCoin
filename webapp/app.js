const view = document.getElementById("view");
const buttons = document.querySelectorAll(".nav-btn");

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
    view.innerHTML = "⏳ جاري التحميل...";

    const res = await fetch(`/static/pages/${page}/${page}.html`);
    view.innerHTML = await res.text();

    loadAssets(page);
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

// تحميل المزرعة افتراضيًا
loadPage("farm");
