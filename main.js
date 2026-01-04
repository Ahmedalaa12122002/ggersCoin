/* =====================================================
   main.js — Navigation + Transitions + Page Guard
===================================================== */

(function(){

// الحالة النشطة عالميًا (لحماية عدم التداخل)
window.__ACTIVE_PAGE__ = "home";

let currentPage = "home";
const content = document.getElementById("content");
const buttons = document.querySelectorAll(".nav-btn");

// ربط الأزرار
buttons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    const page = getPage(btn);
    if(!page || page === currentPage) return;
    setActive(btn);
    switchPage(page);
  });
});

// تحديد الصفحة من نص الزر
function getPage(btn){
  const t = btn.textContent;
  if(t.includes("الرئيسية")) return "home";
  if(t.includes("VIP")) return "vip";
  if(t.includes("المهام")) return "tasks";
  if(t.includes("المحفظة")) return "wallet";
  if(t.includes("الإحالة")) return "referral";
  if(t.includes("الإعدادات")) return "settings";
  if(t.includes("السجلات")) return "logs";
  return null;
}

// تفعيل زر
function setActive(active){
  buttons.forEach(b=>b.classList.remove("active"));
  active.classList.add("active");
}

// التنقّل مع انتقالات + تحديث الحالة
function switchPage(page){
  window.__ACTIVE_PAGE__ = page; // 🔒 الحارس
  currentPage = page;

  content.classList.add("page-exit");

  setTimeout(()=>{
    content.classList.remove("page-exit");

    if(page === "home" && typeof renderHome === "function"){
      renderHome();
    }else{
      content.innerHTML = `
        <div style="padding:40px;text-align:center;color:#aaa">
          🚧 هذه الصفحة قيد التطوير
        </div>`;
    }

    content.classList.add("page-enter");
    setTimeout(()=>content.classList.remove("page-enter"),300);

  },180);
}

// فتح الرئيسية أول مرة
document.addEventListener("DOMContentLoaded",()=>{
  window.__ACTIVE_PAGE__ = "home";
  if(typeof renderHome === "function"){
    renderHome();
  }
});

})();
