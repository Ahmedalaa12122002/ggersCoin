document.addEventListener("DOMContentLoaded", () => {

  const buttons = document.querySelectorAll(".nav-btn");
  const pages = document.querySelectorAll(".page");
  const title = document.getElementById("page-title");

  if (!buttons.length || !pages.length) {
    console.error("Navigation elements not found");
    return;
  }

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
      const page = btn.dataset.page;

      // إخفاء كل الصفحات
      pages.forEach(p => p.classList.remove("active"));

      // إظهار الصفحة المطلوبة
      const target = document.getElementById(page);
      if (target) {
        target.classList.add("active");
      } else {
        console.error("Page not found:", page);
      }

      // تفعيل الزر
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // تغيير العنوان
      if (title && titles[page]) {
        title.textContent = titles[page];
      }
    });
  });

});
