const buttons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");
const title = document.getElementById("page-title");

const titles = {
    play: "Play 🎮",
    tasks: "المهام 📋",
    ref: "الإحالة 👥",
    wallet: "المحفظة 💰",
    vip: "VIP 💎",
    profile: "حسابي 👤",
    log: "السجل 🧾"
};

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const pageId = btn.dataset.page;

        // تفعيل الأزرار
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // تفعيل الصفحات
        pages.forEach(p => p.classList.remove("active"));
        const page = document.getElementById(pageId);
        page.classList.add("active");

        // تغيير العنوان
        title.textContent = titles[pageId];

        // تشغيل Play API
        if (pageId === "play" && window.loadLands) {
            window.loadLands();
        }
    });
});
