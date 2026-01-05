/* =====================================================
   Bottom Navigation Controller (FINAL FIXED)
   WinHive Telegram WebApp
===================================================== */

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

  /* 🔥 الحل هنا */
  // افتح الصفحة الرئيسية أول ما التطبيق يفتح
  openPage(currentPage);
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

/* ---------- PAGE OPEN ---------- */
function openPage(page) {
  const content = document.getElementById("content");
  if (!content) return;

  content.classList.remove("page-enter");
  content.classList.add("page-exit");

  setTimeout(() => {
    content.innerHTML = "";

    switch (page) {
      case "home":
        if (typeof renderHome === "function") renderHome();
        break;
      case "tasks":
        if (typeof renderTasks === "function") renderTasks();
        break;
      case "wallet":
        if (typeof renderWallet === "function") renderWallet();
        break;
      case "vip":
        if (typeof renderVip === "function") renderVip();
        break;
      case "settings":
        if (typeof renderSettings === "function") renderSettings();
        break;
      case "ref":
        if (typeof renderRef === "function") renderRef();
        break;
      case "logs":
        if (typeof renderLogs === "function") renderLogs();
        break;
    }

    content.classList.remove("page-exit");
    content.classList.add("page-enter");
  }, 150);
}

/* ---------- STYLES ---------- */
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
    }

    .nav-btn .icon{
      font-size:22px;
    }

    .nav-btn .label{
      font-size:12px;
    }

    .nav-btn.active{
      color:#ffd54f;
      text-shadow:0 0 8px rgba(255,213,79,.6);
    }

    .nav-btn:active{
      transform:scale(.92);
    }

    .nav-home.active{
      transform:scale(1.15) translateY(-4px);
    }

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
  `;
  document.head.appendChild(style);
}

/* ---------- AUTO START ---------- */
document.addEventListener("DOMContentLoaded", initBottomNavigation);
