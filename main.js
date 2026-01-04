const content = document.getElementById("content");
const buttons = document.querySelectorAll(".nav-btn");

/* ===== Navigation ===== */
function setActive(page){
  buttons.forEach(b=>b.classList.remove("active"));
  const map={
    settings:0,
    vip:1,
    wallet:2,
    home:3,
    tasks:4,
    ref:5,
    logs:6
  };
  if(map[page] !== undefined){
    buttons[map[page]].classList.add("active");
  }
}

function goPage(page){
  content.classList.add("page-exit");

  setTimeout(()=>{
    loadPage(page);
    content.classList.remove("page-exit");
    content.classList.add("page-enter");

    setTimeout(()=>{
      content.classList.remove("page-enter");
    },50);

    setActive(page);
  },200);
}

/* ===== Pages ===== */
function loadPage(page){
  switch(page){
    case "home":
      content.innerHTML=`
        <div class="page-box">
          <h2>🌱 المزرعة</h2>
          <p>هنا هيتم وضع نظام الزراعة والحصاد</p>
        </div>`;
      break;

    case "tasks":
      content.innerHTML=`<div class="page-box">📋 المهام</div>`;
      break;

    case "wallet":
      content.innerHTML=`<div class="page-box">💼 المحفظة</div>`;
      break;

    case "vip":
      content.innerHTML=`<div class="page-box">👑 VIP</div>`;
      break;

    case "ref":
      content.innerHTML=`<div class="page-box">👥 الإحالة</div>`;
      break;

    case "logs":
      content.innerHTML=`<div class="page-box">📜 السجلات</div>`;
      break;

    case "settings":
      content.innerHTML=`<div class="page-box">⚙️ الإعدادات</div>`;
      break;
  }
}

/* ===== Start ===== */
loadPage("home");
