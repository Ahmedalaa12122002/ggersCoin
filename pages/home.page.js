/* ===============================
   Home Page Entry
================================ */

function enterHomePage(){
  if(typeof renderHomeUI==="function"){
    renderHomeUI("content");
  }else{
    console.error("home.ui.js not loaded");
  }
}
