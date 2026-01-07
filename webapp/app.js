const view = document.getElementById("view");
const buttons = document.querySelectorAll(".navbar button");

const pages = {
  play: "Play 🎮",
  tasks: "المهمات 📝",
  wallet: "المحفظة 💰",
  vip: "VIP 💎",
  profile: "حسابي 👤",
  referral: "الإحالة 👥",
  history: "السجل 📜"
};

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    // إزالة active
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // انتقال بسيط
    view.style.opacity = 0;

    setTimeout(() => {
      const page = btn.dataset.page;
      view.innerHTML = `<h1>${pages[page]}</h1>`;
      view.style.opacity = 1;
    }, 200);
  });
});
