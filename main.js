/* =====================================================
   Main Controller
   File: main.js
   Responsibility:
   - Navigation between pages
   - Load correct page logic
   - Prevent UI overlap
   - Single active page at a time
===================================================== */

/* ---------- Global App State ---------- */
let CURRENT_PAGE = null;

/* ---------- Page Clean ---------- */
function clearContent() {
  const content = document.getElementById("content");
  if (content) {
    content.innerHTML = "";
  }
}

/* ---------- Page Switch ---------- */
function switchPage(pageName) {
  if (CURRENT_PAGE === pageName) return;

  CURRENT_PAGE = pageName;
  clearContent();

  console.log("➡️ Switch to:", pageName);

  // إغلاق أي listeners أو intervals لاحقًا
  if (typeof window.onLeavePage === "function") {
    window.onLeavePage();
  }

  // فتح الصفحة المطلوبة
  if (pageName === "home") {
    loadHomePage();
  } else {
    loadPlaceholder(pageName);
  }
}

/* ---------- Home Page ---------- */
function loadHomePage() {
  // تأكيد إن ملفات الصفحة الرئيسية متحمّلة
  if (typeof enterHomePage === "function") {
    enterHomePage();
  } else {
    console.error("❌ enterHomePage not found (home.page.js missing)");
  }
}

/* ---------- Placeholder Pages ---------- */
function loadPlaceholder(name) {
  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = `
    <div style="
      padding:40px;
      text-align:center;
      color:#888;
      font-size:18px">
      📄 صفحة ${name}<br>
      <small>سيتم بناؤها لاحقًا</small>
    </div>
  `;
}

/* ---------- Initial Launch ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // الصفحة الافتراضية
  switchPage("home");
});
