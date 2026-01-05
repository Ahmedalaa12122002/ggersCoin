/* =====================================================
   HOME PAGE – FARM GAME
===================================================== */

const farmState = {
  plots: [
    { planted: false },
    { planted: false },
    { planted: false },
    { planted: false },
    { planted: false },
    { planted: false }
  ]
};

/* -----------------------------------------------------
   رسم الصفحة الرئيسية
----------------------------------------------------- */
function renderHomePage() {
  const app = document.getElementById("app");

  let html = `
    <div style="padding:16px">
      <h2 style="text-align:center">🌱 المزرعة</h2>

      <div style="
        display:grid;
        grid-template-columns: repeat(3, 1fr);
        gap:12px;
        margin-top:20px;
      ">
  `;

  farmState.plots.forEach((plot, i) => {
    html += `
      <div
        onclick="plantCrop(${i})"
        style="
          height:80px;
          background:${plot.planted ? "#4caf50" : "#5d4037"};
          border-radius:12px;
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:22px;
        "
      >
        ${plot.planted ? "🌿" : "🟫"}
      </div>
    `;
  });

  html += `
      </div>

      <button
        onclick="resetFarm()"
        style="
          margin-top:20px;
          width:100%;
          padding:12px;
          font-size:18px;
          border:none;
          border-radius:12px;
          background:#fbc02d;
        "
      >
        🌾 زرع
      </button>
    </div>
  `;

  app.innerHTML = html;
}

/* -----------------------------------------------------
   زرع محصول
----------------------------------------------------- */
function plantCrop(index) {
  farmState.plots[index].planted = true;
  renderHomePage();
}

/* -----------------------------------------------------
   إعادة ضبط المزرعة
----------------------------------------------------- */
function resetFarm() {
  farmState.plots.forEach(p => p.planted = false);
  renderHomePage();
}

/* -----------------------------------------------------
   جسر الربط مع main.js
----------------------------------------------------- */
function renderHome() {
  renderHomePage();
}
