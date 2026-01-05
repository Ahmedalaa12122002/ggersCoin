/* ===============================
   Main Controller
================================ */

let CURRENT_PAGE=null;

function clearContent(){
  document.getElementById("content").innerHTML="";
}

function switchPage(page){
  if(CURRENT_PAGE===page) return;
  CURRENT_PAGE=page;
  clearContent();

  if(page==="home"){
    enterHomePage();
  }else{
    document.getElementById("content").innerHTML=`
      <div style="padding:40px;text-align:center;color:#888">
        صفحة ${page}
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  renderBottomNav();
  document.querySelector('[data-page="home"]').classList.add("active");
  switchPage("home");
});
