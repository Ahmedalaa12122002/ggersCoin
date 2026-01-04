/* =====================================================
   MAIN NAVIGATION SYSTEM — WinHive
   Fixes Home Page Rendering Bug
===================================================== */

const content = document.getElementById("content");

/* ---------- Active Button ---------- */
function setActiveButton(page){
  document.querySelectorAll(".nav-btn").forEach(btn=>{
    btn.classList.toggle("active", btn.dataset.page === page);
  });
}

/* ---------- Navigation ---------- */
function navigateTo(page){
  if (!content) return;

  // تأثير انتقال
  content.classList.add("fade-out");

  setTimeout(() => {
    content.classList.remove("fade-out");
    content.innerHTML = "";
    content.className = "page";

    setActiveButton(page);

    /* ===============================
       HOME (CRITICAL FIX)
    =============================== */
    if (page === "home") {
      if (typeof renderHome === "function") {
        renderHome();   // ✅ إعادة بناء المزرعة دائمًا
      } else {
        content.innerHTML = "<p>خطأ: لم يتم تحميل صفحة الرئيسية</p>";
      }
      return;
    }

    /* ===============================
       OTHER PAGES (STATIC)
    =============================== */
    switch(page){

      case "wallet":
        content.innerHTML = "<h3>💼 المحفظة</h3><p>قريبًا...</p>";
        break;

      case "tasks":
        content.innerHTML = "<h3>📋 المهام</h3><p>قريبًا...</p>";
        break;

      case "vip":
        content.innerHTML = "<h3>👑 VIP</h3><p>قريبًا...</p>";
        break;

      case "settings":
        content.innerHTML = "<h3>⚙️ الإعدادات</h3><p>قريبًا...</p>";
        break;

      case "referral":
        content.innerHTML = "<h3>👥 الإحالة</h3><p>قريبًا...</p>";
        break;

      case "logs":
        content.innerHTML = "<h3>🧾 السجلات</h3><p>قريبًا...</p>";
        break;

      default:
        content.innerHTML = "<p>صفحة غير موجودة</p>";
    }

  }, 180);
}

/* ---------- Nav Buttons ---------- */
document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    navigateTo(btn.dataset.page);
  });
});

/* ---------- Initial Load ---------- */
window.addEventListener("load", ()=>{
  navigateTo("home"); // ✅ إجبار فتح المزرعة عند التشغيل
});
