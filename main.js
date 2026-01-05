/* =====================================================
   MAIN NAVIGATION + ANIMATIONS
===================================================== */

const app = document.getElementById("app");

/* ---------------- Page Loader ---------------- */
function loadPage(page) {
  app.classList.remove("page-show");
  app.classList.add("page-hide");

  setTimeout(() => {
    app.innerHTML = "";

    switch (page) {
      case "home":
        renderHome();
        break;
      case "tasks":
        app.innerHTML = "<h2>📋 المهام</h2>";
        break;
      case "wallet":
        app.innerHTML = "<h2>💼 المحفظة</h2>";
        break;
      case "vip":
        app.innerHTML = "<h2>👑 VIP</h2>";
        break;
      case "settings":
        app.innerHTML = "<h2>⚙️ الإعدادات</h2>";
        break;
      case "ref":
        app.innerHTML = "<h2>👥 الإحالة</h2>";
        break;
      case "logs":
        app.innerHTML = "<h2>📜 السجلات</h2>";
        break;
    }

    app.classList.remove("page-hide");
    app.classList.add("page-show");
  }, 180);
}

/* ---------------- Menu Buttons ---------------- */
document.querySelectorAll("[data-page]").forEach(btn => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    loadPage(btn.dataset.page);
  });
});

/* ---------------- Initial Load ---------------- */
window.onload = () => loadPage("home");
