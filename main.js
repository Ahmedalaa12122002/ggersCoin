/* =====================================================
   MAIN PAGE MANAGER — FINAL STABLE VERSION
   Fix Navigation + Restore Effects
===================================================== */

/* ---------- Global Active Page ---------- */
window.ACTIVE_PAGE = null;

/* ---------- DOM ---------- */
const content = document.getElementById("content");

/* ---------- Page Registry ---------- */
const Pages = {
  home: {
    onEnter: () => typeof onEnterHome === "function" && onEnterHome(),
    onExit: () => typeof onExitHome === "function" && onExitHome()
  },
  vip: { onEnter: () => renderSimplePage("👑 VIP", "قريبًا"), onExit: () => {} },
  tasks: { onEnter: () => renderSimplePage("📋 المهام", "قريبًا"), onExit: () => {} },
  wallet: { onEnter: () => renderSimplePage("💼 المحفظة", "قريبًا"), onExit: () => {} },
  referral:{ onEnter: () => renderSimplePage("👥 الإحالة", "قريبًا"), onExit: () => {} },
  settings:{ onEnter: () => renderSimplePage("⚙️ الإعدادات", "قريبًا"), onExit: () => {} },
  logs: { onEnter: () => renderSimplePage("🧾 السجلات", "قريبًا"), onExit: () => {} }
};

/* ---------- Navigation ---------- */
function navigateTo(page) {
  if (window.ACTIVE_PAGE === page) return;

  if (window.ACTIVE_PAGE && Pages[window.ACTIVE_PAGE]) {
    Pages[window.ACTIVE_PAGE].onExit();
  }

  window.ACTIVE_PAGE = page;

  if (Pages[page]) {
    Pages[page].onEnter();
  }

  updateActiveNav(page);
}

/* ---------- Simple Renderer ---------- */
function renderSimplePage(title, text) {
  if (!content) return;
  content.innerHTML = `
    <div style="padding:20px;text-align:center">
      <h2>${title}</h2>
      <p>${text}</p>
    </div>
  `;
}

/* ---------- Active Button Effect ---------- */
function updateActiveNav(page) {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  const active = document.querySelector(`.nav-btn[data-page="${page}"]`);
  if (active) active.classList.add("active");
}

/* =====================================================
   🔥 NAV FIX (FINAL)
===================================================== */

/* 1️⃣ منع أي محتوى من خطف الضغط */
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.innerHTML = `
    .nav-bar{
      position:fixed;
      bottom:0;
      width:100%;
      z-index:99999;
      pointer-events:auto;
    }
    #content{
      position:relative;
      z-index:1;
      pointer-events:auto;
    }
    .nav-btn{
      transition:all .25s ease;
      cursor:pointer;
    }
    .nav-btn.active{
      box-shadow:0 0 14px rgba(255,200,0,.6);
      transform:scale(1.08);
    }
    .nav-btn:active{
      transform:scale(.92);
    }
  `;
  document.head.appendChild(style);
});

/* 2️⃣ التقاط الضغط من الجذر */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".nav-btn");
  if (!btn) return;

  const page = btn.dataset.page;
  if (!page) return;

  navigateTo(page);
});

/* ---------- Start ---------- */
document.addEventListener("DOMContentLoaded", () => {
  navigateTo("home");
});
