/* =====================================================
   MAIN NAVIGATION CONTROLLER
===================================================== */

const appContainer = document.getElementById("app");

/* -----------------------------------------------------
   تحميل الصفحات
----------------------------------------------------- */
function loadPage(pageName) {
  appContainer.innerHTML = "";

  switch (pageName) {
    case "home":
      if (typeof renderHome === "function") {
        renderHome();
      } else {
        appContainer.innerHTML = "❌ home.page.js غير محمّل";
      }
      break;

    case "tasks":
      appContainer.innerHTML = "<h2>📋 المهام</h2>";
      break;

    case "wallet":
      appContainer.innerHTML = "<h2>💼 المحفظة</h2>";
      break;

    case "vip":
      appContainer.innerHTML = "<h2>👑 VIP</h2>";
      break;

    case "settings":
      appContainer.innerHTML = "<h2>⚙️ الإعدادات</h2>";
      break;

    case "ref":
      appContainer.innerHTML = "<h2>👥 الإحالة</h2>";
      break;

    case "logs":
      appContainer.innerHTML = "<h2>📜 السجلات</h2>";
      break;

    default:
      appContainer.innerHTML = "❌ صفحة غير معروفة";
  }
}

/* -----------------------------------------------------
   أزرار القائمة
----------------------------------------------------- */
document.querySelectorAll("[data-page]").forEach(btn => {
  btn.addEventListener("click", () => {
    const page = btn.getAttribute("data-page");
    loadPage(page);
  });
});

/* -----------------------------------------------------
   تحميل الصفحة الرئيسية عند البدء
----------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  loadPage("home");
});
