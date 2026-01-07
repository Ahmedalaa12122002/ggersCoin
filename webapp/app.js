const view = document.getElementById("view");

document.querySelectorAll("button[data-page]").forEach(btn => {
  btn.addEventListener("click", () => loadPage(btn.dataset.page));
});

function loadPage(page) {
  view.classList.add("fade-out");

  setTimeout(async () => {
    const res = await fetch(`pages/${page}/${page}.html`);
    view.innerHTML = await res.text();
    view.classList.remove("fade-out");

    loadAssets(page);
  }, 200);
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
