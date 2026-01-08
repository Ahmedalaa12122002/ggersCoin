document.addEventListener("DOMContentLoaded", () => {

    // =============================
    // عناصر الصفحة
    // =============================
    const buttons = document.querySelectorAll(".nav-btn");
    const content = document.getElementById("content");
    const title = document.getElementById("page-title");

    // =============================
    // أسماء الصفحات
    // =============================
    const pages = {
        play: "Play 🎮",
        tasks: "المهام 📝",
        referral: "الإحالة 👥",
        wallet: "المحفظة 💰",
        vip: "VIP 💎",
        profile: "حسابي 👤",
        history: "سجل 📜"
    };

    // =============================
    // تحميل صفحة
    // =============================
    async function loadPage(page) {
        try {
            content.classList.remove("show");
            content.classList.add("hide");

            const res = await fetch(`/webapp/pages/${page}/index.html`);
            if (!res.ok) throw new Error("Page not found");

            const html = await res.text();

            setTimeout(() => {
                content.innerHTML = html;
                content.classList.remove("hide");
                content.classList.add("show");
            }, 200);

            title.textContent = pages[page] || "GgersCoin";

        } catch (err) {
            content.innerHTML = `
                <div class="error">
                    ⚠️ الصفحة غير متاحة
                </div>
            `;
        }
    }

    // =============================
    // التحكم في الأزرار
    // =============================
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {

            // إزالة active من الجميع
            buttons.forEach(b => b.classList.remove("active"));

            // تفعيل الزر الحالي
            btn.classList.add("active");

            // تحميل الصفحة
            const page = btn.dataset.page;
            loadPage(page);
        });
    });

    // =============================
    // تحميل صفحة Play افتراضيًا
    // =============================
    const defaultBtn = document.querySelector('.nav-btn[data-page="play"]');
    if (defaultBtn) {
        defaultBtn.classList.add("active");
        loadPage("play");
    }

});
