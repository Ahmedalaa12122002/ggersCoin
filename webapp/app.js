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
  btn.onclick = () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    view.innerHTML = `<h1>${pages[btn.dataset.page]}</h1>`;
  };
});
