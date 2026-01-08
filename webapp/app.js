const view = document.getElementById("view");
const buttons = document.querySelectorAll(".bottom-nav button");

function loadPage(page) {
  fetch(`pages/${page}/index.html`)
    .then(res => {
      if (!res.ok) throw new Error("Not Found");
      return res.text();
    })
    .then(html => {
      view.innerHTML = html;
    })
    .catch(() => {
      view.innerHTML = "<h3>الصفحة غير متوفرة</h3>";
    });
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadPage(btn.dataset.page);
  });
});

// تحميل Play تلقائي
loadPage("play");
