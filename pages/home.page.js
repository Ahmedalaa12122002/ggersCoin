/* =====================================================
   Home Page
   File: pages/home/home.page.js
   Responsibility:
   - Entry point for Home page
   - Call Home UI renderer
   - No game logic
   - No timers
   - No state
===================================================== */

// تأكيد إن الصفحة الرئيسية اتفتحت فعلاً
function enterHomePage() {
  // تأكيد وجود الكونتينر
  const content = document.getElementById("content");
  if (!content) {
    console.error("❌ #content not found");
    return;
  }

  // تشغيل واجهة المزرعة فقط
  if (typeof renderHomeUI === "function") {
    renderHomeUI("content");
  } else {
    console.error("❌ renderHomeUI not found (home.ui.js not loaded)");
  }
}

// استدعاء الصفحة الرئيسية
enterHomePage();
