window.currentPage = "home";

function goPage(page){
  window.currentPage = page;

  document.querySelectorAll(".nav button").forEach(btn=>{
    btn.classList.remove("active");
    if(btn.dataset.page === page){
      btn.classList.add("active");
    }
  });

  if(page === "home"){
    renderHome();
  }else{
    document.getElementById("content").innerHTML =
      `<div class="fade">📄 ${page} (قيد التطوير)</div>`;
  }
}
