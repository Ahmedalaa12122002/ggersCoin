const buttons = document.querySelectorAll(".nav-btn");
const title = document.getElementById("page-title");
const content = document.getElementById("page-content");
const loader = document.getElementById("loader");

const clickSound = new Audio("/webapp/click.mp3");

const pages = {
  play: "🎮 Play",
  tasks: "📋 المهام",
  referral: "👥 الإحالة",
  wallet: "💰 المحفظة",
  vip: "💎 VIP",
  profile: "👤 حسابي",
  history: "🧾 السجل"
};

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const page = btn.dataset.page;

    try { clickSound.play(); } catch {}
    if (navigator.vibrate) navigator.vibrate(40);

    loader.classList.remove("hidden");
    content.innerHTML = "";

    setTimeout(() => {
      loader.classList.add("hidden");
      title.textContent = pages[page];
      content.innerHTML = `تم فتح صفحة ${pages[page]}`;
      showToast("تم الانتقال بنجاح");
    }, 400);
  });
});

// Splash hide
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").remove();
  }, 1200);
});

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
