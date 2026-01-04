/* =====================================================
   main.js
   Navigation Controller – WinHive
   مسؤول عن القوائم فقط
===================================================== */

const content = document.getElementById("content");

/* ---------- Helper ---------- */
function clearContent() {
  if (content) content.innerHTML = "";
}

/* ---------- Navigation State ---------- */
let currentPage = null;

/* ---------- Active Button ---------- */
function setActiveButton(name) {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  const target = document.querySelector(`.nav-btn[data-page="${name}"]`);
  if (target) target.classList.add("active");
}

/* =====================================================
   Page Openers
===================================================== */

function openHome() {
  currentPage = "home";
  setActiveButton("home");
  clearContent();

  if (typeof renderHome === "function") {
    renderHome();
  } else {
    content.innerHTML = "❌ لم يتم تحميل لعبة المزرعة";
  }
}

function openTasks() {
  currentPage = "tasks";
  setActiveButton("tasks");
  clearContent();
  content.innerHTML = "<h3 style='color:white'>📋 المهام (قريبًا)</h3>";
}

function openReferral() {
  currentPage = "referral";
  setActiveButton("referral");
  clearContent();
  content.innerHTML = "<h3 style='color:white'>👥 الإحالة (قريبًا)</h3>";
}

function openWallet() {
  currentPage = "wallet";
  setActiveButton("wallet");
  clearContent();
  content.innerHTML = "<h3 style='color:white'>💼 المحفظة (قريبًا)</h3>";
}

function openVip() {
  currentPage = "vip";
  setActiveButton("vip");
  clearContent();
  content.innerHTML = "<h3 style='color:white'>👑 VIP (قريبًا)</h3>";
}

function openSettings() {
  currentPage = "settings";
  setActiveButton("settings");
  clearContent();
  content.innerHTML = "<h3 style='color:white'>⚙️ الإعدادات (قريبًا)</h3>";
}

function openLogs() {
  currentPage = "logs";
  setActiveButton("logs");
  clearContent();
  content.innerHTML = "<h3 style='color:white'>🧾 السجلات (قريبًا)</h3>";
}

/* =====================================================
   Auto Start
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  openHome(); // أول صفحة
});
