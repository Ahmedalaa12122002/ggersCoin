document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".nav-btn");
    const pages = document.querySelectorAll(".page");
    const title = document.getElementById("page-title");

    const clickSound = new Audio("/webapp/click.mp3");

    const titles = {
        play: "Play 🎮",
        tasks: "المهام 📋",
        ref: "الإحالة 👥",
        wallet: "المحفظة 💰",
        vip: "VIP 💎",
        profile: "حسابي 👤",
        log: "سجل 🧾"
    };

    function vibrate() {
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }

    function showPage(pageId) {
        pages.forEach(p => p.classList.remove("active"));
        buttons.forEach(b => b.classList.remove("active"));

        const page = document.getElementById(pageId);
        const btn = document.querySelector(`[data-page="${pageId}"]`);

        if (page && btn) {
            page.classList.add("active");
            btn.classList.add("active");
        }

        title.textContent = titles[pageId] || "GgersCoin";
    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.dataset.page;

            try { clickSound.currentTime = 0; clickSound.play(); } catch {}
            vibrate();
            showPage(page);
        });
    });

    // Default page
    showPage("play");
});
// Hide splash after load
window.addEventListener("load", () => {
    setTimeout(() => {
        const splash = document.getElementById("splash");
        if (splash) splash.remove();
    }, 1200);
});
