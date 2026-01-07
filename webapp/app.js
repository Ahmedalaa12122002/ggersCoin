const view = document.getElementById("view");
const buttons = document.querySelectorAll(".bottom-nav button");

function loadPage(page) {
  view.style.opacity = "0";

  fetch(`./pages/${page}/index.html`)
    .then(res => res.text())
    .then(html => {
      setTimeout(() => {
        view.innerHTML = html;
        view.style.opacity = "1";
      }, 200);
    })
    .catch(() => {
      view.innerHTML = "<h3>الصفحة غير موجودة</h3>";
      view.style.opacity = "1";
    });
}

// تحميل Play افتراضي
loadPage("play");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadPage(btn.dataset.page);
  });
});
