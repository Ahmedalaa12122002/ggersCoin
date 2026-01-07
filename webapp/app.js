const view = document.getElementById("view");
const buttons = document.querySelectorAll(".navbar button");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    setActive(btn);
    loadPage(btn.dataset.page);
  });
});

function setActive(activeBtn) {
  buttons.forEach(b => b.classList.remove("active"));
  activeBtn.classList.add("active");
}

async function loadPage(page) {
  view.classList.add("hide");

  setTimeout(async () => {
    const res = await fetch(`pages/${page}/${page}.html`);
    view.innerHTML = await res.text();
    view.classList.remove("hide");

    loadAssets(page);
  }, 250);
}

function loadAssets(page) {
  removeOld("page-style");
  removeOld("page-script");

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = `pages/${page}/${page}.css`;
  css.id = "page-style";
  document.head.appendChild(css);

  const js = document.createElement("script");
  js.src = `pages/${page}/${page}.js`;
  js.id = "page-script";
  document.body.appendChild(js);
}

function removeOld(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}
