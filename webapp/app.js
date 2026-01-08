document.addEventListener("DOMContentLoaded", () => {
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
        log: "سجل 🧾"
    };

    function showPage(pageId) {
        pages.forEach(p => p.classList.remove("active"));
        buttons.forEach(b => b.classList.remove("active"));

        document.getElementById(pageId).classList.add("active");
        document.querySelector(`[data-page="${pageId}"]`).classList.add("active");

        title.textContent = titles[pageId] || "GgersCoin";
    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.dataset.page;
            showPage(page);
        });
    });

    // الصفحة الافتراضية
    showPage("play");
});
