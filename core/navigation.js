/* =====================================================
   Bottom Navigation Controller (FINAL)
   WinHive Telegram WebApp
   ===================================================== */

/*
  مسؤولية الملف:
  - إنشاء 7 قوائم سفلية
  - التحكم في الزر النشط
  - الانتقالات والمؤثرات
  - فتح الصفحة المطلوبة بدون تداخل
*/

/* ---------- CONFIG ---------- */
const NAV_ITEMS = [
  { id: "settings", label: "الإعدادات", icon: "⚙️" },
  { id: "vip",      label: "VIP",       icon: "👑" },
  { id: "wallet",   label: "المحفظة",    icon: "💼" },
  { id: "home",     label: "الرئيسية",   icon: "🏠", main: true },
  { id: "tasks",    label: "المهام",     icon: "📋" },
  { id: "ref",      label: "الإحالة",    icon: "👥" },
  { id: "logs",     label: "السجلات",    icon: "🧾" }
];

let currentPage = "home";

/* ---------- INIT ---------- */
function initBottomNavigation() {
  injectNavStyles();

  const nav = document.createElement("div");
  nav.id = "bottomNav";
  nav.className = "bottom-nav";

  NAV_ITEMS.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "nav-btn";
    btn.dataset.page = item.id;

    if (item.main) btn.classList.add("nav-home");
    if (item.id === currentPage) btn.classList.add("active");

    btn.innerHTML = `
      <div class="icon">${item.icon}</div>
      <div class="label">${item.label}</div>
    `;

    btn.onclick = () => handleNavClick(item.id);
    nav.appendChild(btn);
  });

  document.body.appendChild(nav);
}

/* ---------- CLICK HANDLER ---------- */
function handleNavClick(page) {
  if (page === currentPage) return;

  currentPage = page;
  updateActiveButton(page);
  openPage(page);
}

/* ---------- ACTIVE STATE ---------- */
function updateActiveButton(page) {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });
}

/* ---------- PAGE OPEN (HOOK) ---------- */
function openPage(page) {
  const content = document.getElementById("content");
  if (!content) return;

  content.classList.remove("page-enter");
  content.classList.add("page-exit");

  setTimeout(() => {
    content.innerHTML = "";

    /*
      الربط هنا فقط
      كل صفحة لها ملفها الخاص
      هذا الملف لا يعرف أي منطق داخلي
    */
    switch (page) {
      case "home":
        if (typeof renderHome === "function") renderHome();
        break;
      case "tasks":
        content.innerHTML = `<div class="page-box">📋 المهام</div>`;
        break;
      case "wallet":
        content.innerHTML = `<div class="page-box">💼 المحفظة</div>`;
        break;
      case "vip":
        content.innerHTML = `<div class="page-box">👑 VIP</div>`;
        break;
      case "settings":
        content.innerHTML = `<div class="page-box">⚙️ الإعدادات</div>`;
        break;
      case "ref":
        content.innerHTML = `<div class="page-box">👥 الإحالة</div>`;
        break;
      case "logs":
        content.innerHTML = `<div class="page-box">🧾 السجلات</div>`;
        break;
    }

    content.classList.remove("page-exit");
    content.classList.add("page-enter");
  }, 180);
}

/* ---------- STYLES (RESPONSIVE) ---------- */
function injectNavStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
    .bottom-nav{
      position:fixed;
      bottom:0;
      left:0;
      right:0;
      height:82px;
      background:#0b0b0b;
      display:flex;
      border-top:1px solid #222;
      z-index:999;
    }

    .nav-btn{
      flex:1;
      background:none;
      border:none;
      color:#aaa;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:4px;
      cursor:pointer;
      transition:all .25s ease;
      min-width:0;
    }

    .nav-btn .icon{
      font-size:clamp(18px, 5vw, 22px);
      line-height:1;
    }

    .nav-btn .label{
      font-size:clamp(10px, 2.6vw, 12px);
      white-space:nowrap;
    }

    .nav-btn.active{
      color:#ffd54f;
      text-shadow:
        0 0 6px rgba(255,213,79,.7),
        0 0 12px rgba(255,213,79,.4);
    }

    .nav-btn:active{
      transform:scale(.92);
    }

    .nav-home.active{
      transform:scale(1.15) translateY(-4px);
    }

    /* Page animation */
    #content{
      transition:opacity .25s ease, transform .25s ease;
    }
    .page-exit{
      opacity:0;
      transform:translateY(10px);
    }
    .page-enter{
      opacity:1;
      transform:translateY(0);
    }

    .page-box{
      padding:24px;
      text-align:center;
      font-size:18px;
    }
  `;
  document.head.appendChild(style);
}

/* ---------- AUTO START ---------- */
document.addEventListener("DOMContentLoaded", initBottomNavigation);
