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
    const page = btn.dataset.page;

    // تغيير الصفحة
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");

    // تفعيل الزر
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // تغيير العنوان
    title.textContent = titles[page] || "GgersCoin";
  });
});
