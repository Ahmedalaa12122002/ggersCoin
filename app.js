const content = document.getElementById("content");

const pages = {
  profile: "pages/profile.js",
  wallet: "pages/wallet.js",
  vip: "pages/vip.js",
  play: "pages/play.js",
  tasks: "pages/tasks.js",
  referral: "pages/referral.js",
  history: "pages/history.js"
};

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const page = btn.dataset.page;

    if (pages[page]) {
      loadPage(pages[page]);
    }
  });
});

function loadPage(src) {
  const script = document.createElement("script");
  script.src = src + "?v=" + Date.now(); // منع الكاش
  document.body.appendChild(script);
}
