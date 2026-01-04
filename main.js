/* =====================================================
   MAIN NAVIGATION SYSTEM — WinHive
   FINAL SAFE VERSION
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

  content.classList.add("fade-out");

  setTimeout(() => {
    content.classList.remove("fade-out");
    content.innerHTML = "";
    content.className = "page";

    setActiveButton(page);

    /* ===============================
       HOME — SAFE RENDER
    =============================== */
    if (page === "home") {
      if (typeof window.renderHome === "function") {
        window.renderHome();
      } else {
        content.innerHTML = `
          <div style="text-align:center;padding:20px;color:#ccc">
            ⏳ يتم تحميل اللعبة...
          </div>`;
        waitForHome();
      }
      return;
    }

    /* ===============================
       OTHER PAGES
    =============================== */
    switch(page){
      case "wallet":
        content.innerHTML = "<h3>💼 المحفظة</h3>";
        break;
      case "tasks":
        content.innerHTML = "<h3>📋 المهام</h3>";
        break;
      case "vip":
        content.innerHTML = "<h3>👑 VIP</h3>";
        break;
      case "settings":
        content.innerHTML = "<h3>⚙️ الإعدادات</h3>";
        break;
      case "referral":
        content.innerHTML = "<h3>👥 الإحالة</h3>";
        break;
      case "logs":
        content.innerHTML = "<h3>🧾 السجلات</h3>";
        break;
    }

  }, 180);
}

/* ---------- Wait for Home Loader ---------- */
function waitForHome(){
  const interval = setInterval(()=>{
    if (typeof window.renderHome === "function") {
      clearInterval(interval);
      navigateTo("home");
    }
  }, 100);
}

/* ---------- Nav Buttons ---------- */
document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    navigateTo(btn.dataset.page);
  });
});

/* ---------- Initial Load ---------- */
window.addEventListener("DOMContentLoaded", ()=>{
  navigateTo("home");
});
