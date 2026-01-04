/* =====================================================
   MAIN PAGE MANAGER
   WinHive Mini App
===================================================== */

/* ---------- Global Active Page ---------- */
// الصفحة النشطة حاليًا
window.ACTIVE_PAGE = null;

/* ---------- DOM ---------- */
const content = document.getElementById("content");

/* ---------- Page Registry ---------- */
/*
  كل صفحة لها:
  - onEnter(): ماذا يحدث عند الدخول
  - onExit(): ماذا يحدث عند الخروج
*/
const Pages = {
  home: {
    onEnter: () => {
      if (typeof onEnterHome === "function") {
        onEnterHome();
      }
    },
    onExit: () => {
      if (typeof onExitHome === "function") {
        onExitHome();
      }
    }
  },

  vip: {
    onEnter: () => {
      renderSimplePage("👑 VIP", "نظام VIP سيتم إضافته لاحقًا");
    },
    onExit: () => {}
  },

  tasks: {
    onEnter: () => {
      renderSimplePage("📋 المهام", "قائمة المهام");
    },
    onExit: () => {}
  },

  wallet: {
    onEnter: () => {
      renderSimplePage("💼 المحفظة", "السحب والإيداع");
    },
    onExit: () => {}
  },

  referral: {
    onEnter: () => {
      renderSimplePage("👥 الإحالة", "نظام الإحالات");
    },
    onExit: () => {}
  },

  settings: {
    onEnter: () => {
      renderSimplePage("⚙️ الإعدادات", "الإعدادات العامة");
    },
    onExit: () => {}
  },

  logs: {
    onEnter: () => {
      renderSimplePage("🧾 السجلات", "سجل العمليات");
    },
    onExit: () => {}
  }
};

/* ---------- Navigation ---------- */
function navigateTo(pageName) {
  if (window.ACTIVE_PAGE === pageName) return;

  // خروج من الصفحة الحالية
  if (window.ACTIVE_PAGE && Pages[window.ACTIVE_PAGE]) {
    Pages[window.ACTIVE_PAGE].onExit();
  }

  // تعيين الصفحة الجديدة
  window.ACTIVE_PAGE = pageName;

  // دخول الصفحة الجديدة
  if (Pages[pageName]) {
    Pages[pageName].onEnter();
  } else {
    console.warn("Page not found:", pageName);
  }

  updateActiveNav(pageName);
}

/* ---------- Simple Page Renderer ---------- */
function renderSimplePage(title, text) {
  if (!content) return;

  content.innerHTML = `
    <div style="padding:20px;text-align:center">
      <h2>${title}</h2>
      <p>${text}</p>
    </div>
  `;
}

/* ---------- Bottom Navigation Highlight ---------- */
function updateActiveNav(pageName) {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  const activeBtn = document.querySelector(
    `.nav-btn[data-page="${pageName}"]`
  );

  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}

/* ---------- Safe Bootstrap ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // الدخول الافتراضي على الرئيسية
  navigateTo("home");
});
