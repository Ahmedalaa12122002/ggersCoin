/* =====================================================
   Navigation Core – ثابت ولا يتغير
===================================================== */

const content = document.getElementById("content");
const buttons = document.querySelectorAll(".nav-btn");

/* تغيير الزر النشط */
function setActive(page){
  buttons.forEach(btn=>{
    btn.classList.toggle("active", btn.dataset.page === page);
  });
}

/* مسح المحتوى */
function clearContent(){
  content.innerHTML = "";
}

/* فتح صفحة */
function openPage(page){
  content.classList.add("fade");

  setTimeout(()=>{
    content.classList.remove("fade");
    clearContent();
    setActive(page);

    // صفحات مؤقتة (Placeholder)
    switch(page){
      case "home":
        content.innerHTML = `<div class="page-box">🏠 الصفحة الرئيسية</div>`;
        break;

      case "tasks":
        content.innerHTML = `<div class="page-box">📋 صفحة المهام</div>`;
        break;

      case "referral":
        content.innerHTML = `<div class="page-box">👥 صفحة الإحالة</div>`;
        break;

      case "wallet":
        content.innerHTML = `<div class="page-box">💼 صفحة المحفظة</div>`;
        break;

      case "vip":
        content.innerHTML = `<div class="page-box">👑 صفحة VIP</div>`;
        break;

      case "settings":
        content.innerHTML = `<div class="page-box">⚙️ صفحة الإعدادات</div>`;
        break;

      case "logs":
        content.innerHTML = `<div class="page-box">🧾 صفحة السجلات</div>`;
        break;
    }
  },180);
}

/* ربط الأزرار */
buttons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    openPage(btn.dataset.page);
  });
});

/* تشغيل افتراضي */
<script src="pages/home.page.js"></script>
