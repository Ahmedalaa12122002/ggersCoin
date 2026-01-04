/* =====================================================
   main.js — Navigation Controller
   Responsibility: Page switching only
===================================================== */

(function navigationController(){

  // حفظ الصفحة الحالية
  let currentPage = "home";

  // تشغيل بعد تحميل الصفحة
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigation);
  } else {
    initNavigation();
  }

  function initNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    if (!navButtons.length) {
      console.warn("⚠️ No navigation buttons found");
      return;
    }

    navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const page = getPageFromButton(btn);
        if (!page) return;

        switchPage(page);
        setActiveButton(btn);
      });
    });

    // الصفحة الافتراضية
    switchPage("home");
  }

  /* ---------- Page Resolver ---------- */
  function getPageFromButton(button) {
    const text = button.textContent.trim();

    if (text.includes("الرئيسية")) return "home";
    if (text.includes("VIP")) return "vip";
    if (text.includes("المهام")) return "tasks";
    if (text.includes("المحفظة")) return "wallet";
    if (text.includes("الإحالة")) return "referral";
    if (text.includes("الإعدادات")) return "settings";
    if (text.includes("السجلات")) return "logs";

    return null;
  }

  /* ---------- Switch Page ---------- */
  function switchPage(page) {
    if (page === currentPage) return;
    currentPage = page;

    const content = document.getElementById("content");
    if (!content) return;

    // حاليًا صفحة واحدة فقط
    if (page === "home") {
      if (typeof renderHome === "function") {
        renderHome();
      } else {
        content.innerHTML = "<p style='padding:20px'>الصفحة غير جاهزة</p>";
      }
      return;
    }

    // الصفحات غير الجاهزة بعد
    content.innerHTML = `
      <div style="
        padding:40px;
        text-align:center;
        color:#aaa;
        font-size:14px">
        🚧 هذه الصفحة قيد التطوير
      </div>
    `;
  }

  /* ---------- Active Button ---------- */
  function setActiveButton(activeBtn) {
    document.querySelectorAll(".nav-btn")
      .forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  }

})();
/* =====================================================
   PART 8 — PAGE TRANSITION FIX
   (NO FUNCTION REDEFINITION)
===================================================== */

(function enablePageTransitions(){

  const content = document.getElementById("content");
  if (!content) return;

  // نراقب الضغط على أزرار القوائم
  document.querySelectorAll(".nav-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      // خروج الصفحة الحالية
      content.classList.add("page-exit");

      setTimeout(()=>{
        content.classList.remove("page-exit");
        content.classList.add("page-enter");

        setTimeout(()=>{
          content.classList.remove("page-enter");
        }, 300);

      }, 150);
    });
  });

})();
