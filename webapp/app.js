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
        log: "السجل 🧾"
    };

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {

            // إزالة active من كل الأزرار
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // إخفاء كل الصفحات
            pages.forEach(p => p.classList.remove("active"));

            // إظهار الصفحة المطلوبة
            const pageId = btn.dataset.page;
            const page = document.getElementById(pageId);
            if (page) page.classList.add("active");

            // تغيير العنوان
            title.textContent = titles[pageId] || "GgersCoin";
        });
    });

});
