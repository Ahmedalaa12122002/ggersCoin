let currentPage = "home";

function goPage(page) {
  currentPage = page;

  document.querySelectorAll(".nav button").forEach(btn => {
    btn.classList.remove("active");
  });

  document.querySelectorAll(".nav button").forEach(btn => {
    if (btn.getAttribute("onclick")?.includes(page)) {
      btn.classList.add("active");
    }
  });

  if (page === "home") {
    renderHome();
  } else {
    document.getElementById("content").innerHTML =
      `<div style="padding:20px;text-align:center">📄 ${page} (قيد التطوير)</div>`;
  }
}
