/* =====================================================
   MAIN PAGE MANAGER — FINAL FIXED VERSION
===================================================== */

window.ACTIVE_PAGE = "home";

const content = document.getElementById("content");

/* ---------- Page Registry ---------- */
const Pages = {
  home: {
    onEnter: () => window.onEnterHome && window.onEnterHome(),
    onExit: () => window.onExitHome && window.onExitHome()
  },
  vip:      { onEnter: () => renderPage("👑 VIP"), onExit: () => {} },
  tasks:    { onEnter: () => renderPage("📋 المهام"), onExit: () => {} },
  wallet:   { onEnter: () => renderPage("💼 المحفظة"), onExit: () => {} },
  referral: { onEnter: () => renderPage("👥 الإحالة"), onExit: () => {} },
  settings: { onEnter: () => renderPage("⚙️ الإعدادات"), onExit: () => {} },
  logs:     { onEnter: () => renderPage("🧾 السجلات"), onExit: () => {} }
};

/* ---------- Navigation ---------- */
function navigateTo(page) {
  if (window.ACTIVE_PAGE === page) return;

  Pages[window.ACTIVE_PAGE]?.onExit();
  window.ACTIVE_PAGE = page;

  fadeOut(() => {
    Pages[page]?.onEnter();
    updateActiveNav(page);
    fadeIn();
  });
}

/* ---------- Simple Page ---------- */
function renderPage(title) {
  content.innerHTML = `
    <div class="page fade">
      <h2>${title}</h2>
      <p>قريبًا...</p>
    </div>
  `;
}

/* ---------- Active Button ---------- */
function updateActiveNav(page) {
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  document.querySelector(`.nav-btn[data-page="${page}"]`)?.classList.add("active");
}

/* ---------- Events ---------- */
document.addEventListener("click", e => {
  const btn = e.target.closest(".nav-btn");
  if (!btn) return;
  navigateTo(btn.dataset.page);
});

/* ---------- Transitions ---------- */
function fadeOut(cb) {
  content.classList.add("fade-out");
  setTimeout(cb, 200);
}

function fadeIn() {
  content.classList.remove("fade-out");
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  Pages.home.onEnter();
  updateActiveNav("home");
});
