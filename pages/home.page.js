/* =====================================================
   HOME PAGE – FARM GAME
===================================================== */

const farm = {
  plots: Array.from({ length: 6 }, () => ({
    planted: false
  }))
};

/* ---------------- Render ---------------- */
function renderHome() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="farm">
      <h2>🌱 المزرعة</h2>

      <div class="farm-grid">
        ${farm.plots
          .map(
            (p, i) => `
          <div class="plot ${p.planted ? "planted" : ""}" data-index="${i}">
            ${p.planted ? "🌿" : "🟫"}
          </div>
        `
          )
          .join("")}
      </div>

      <button id="plantBtn">🌾 زرع</button>
    </div>
  `;

  bindFarmEvents();
}

/* ---------------- Events ---------------- */
function bindFarmEvents() {
  document.querySelectorAll(".plot").forEach(plot => {
    plot.onclick = () => {
      const i = plot.dataset.index;
      farm.plots[i].planted = true;
      plot.classList.add("planted");
      plot.innerHTML = "🌿";
    };
  });

  document.getElementById("plantBtn").onclick = () => {
    farm.plots.forEach(p => (p.planted = false));
    renderHome();
  };
}
