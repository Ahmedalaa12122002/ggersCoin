const content = document.getElementById("content");

const pages = {
  play: "/static/pages/play/ui.js",
  profile: "/static/pages/profile/ui.js",
  wallet: "/static/pages/wallet/ui.js",
  vip: "/static/pages/vip/ui.js",
  tasks: "/static/pages/tasks/ui.js",
  referral: "/static/pages/referral/ui.js",
  history: "/static/pages/history/ui.js"
};

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    const page = btn.dataset.page;
    loadPage(pages[page]);
  };
});

function loadPage(src) {
  const s = document.createElement("script");
  s.src = src + "?v=" + Date.now();
  document.body.appendChild(s);
}
