Telegram.WebApp.ready();

const content = document.getElementById("content");
const buttons = document.querySelectorAll(".nav-btn");

let currentPage = "home";

function setActive(btn){
  buttons.forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
}

function loadPage(name){
  currentPage = name;
  if(window.pages && typeof window.pages[name] === "function"){
    window.pages[name]();
  }else{
    content.innerHTML = `<h3>${name}</h3><p>قيد التطوير</p>`;
  }
}

buttons.forEach(btn=>{
  btn.onclick = ()=>{
    const page = btn.dataset.page;
    setActive(btn);
    loadPage(page);
  };
});

// تحميل الرئيسية عند البدء
loadPage("home");
