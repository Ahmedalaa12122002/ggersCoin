/* =====================================================
   Home Page
   File: pages/home.page.js
   Responsibility:
   - Render Home Screen content ONLY
   - Home stats
   - Farm game (12 plots)
   - No navigation logic
   - Stable & extendable
===================================================== */

/* ---------- Farm State (LOCAL) ---------- */
const farmState = {
  plots: Array.from({ length: 12 }, () => ({
    planted: false,
    ready: false
  }))
};

/* =====================================================
   Render Home
===================================================== */
function renderHome() {
  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = `
    <style>
      .home-wrapper{
        padding:16px;
        padding-bottom:20px;
        max-width:480px;
        margin:0 auto;
      }

      /* ---------- Header ---------- */
      .home-header{
        text-align:center;
        margin-bottom:14px;
      }

      .home-header h2{
        margin:0;
        font-size:22px;
        color:#ffd54f;
      }

      .home-header p{
        margin-top:6px;
        font-size:13px;
        color:#aaa;
      }

      /* ---------- Stats ---------- */
      .home-stats{
        display:flex;
        gap:10px;
        margin-bottom:16px;
      }

      .stat-card{
        flex:1;
        background:#0f0f0f;
        border-radius:14px;
        padding:10px;
        text-align:center;
        box-shadow:inset 0 0 0 1px #1f1f1f;
      }

      .stat-card .value{
        font-size:18px;
        color:#ffd54f;
        font-weight:600;
      }

      .stat-card .label{
        font-size:11px;
        color:#888;
        margin-top:2px;
      }

      /* ---------- Game Box ---------- */
      .game-box{
        background:#111;
        border-radius:16px;
        padding:14px;
        box-shadow:
          inset 0 0 0 1px #222,
          0 6px 20px rgba(0,0,0,.4);
      }

      /* ---------- Farm Grid ---------- */
      .farm-grid{
        display:grid;
        grid-template-columns:repeat(3, 1fr);
        gap:10px;
      }

      .farm-plot{
        height:80px;
        border-radius:14px;
        background:linear-gradient(#5d4037, #3e2723);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:26px;
        cursor:pointer;
        transition:transform .15s ease, box-shadow .15s ease;
        box-shadow:inset 0 0 0 1px #2a2a2a;
      }

      .farm-plot:active{
        transform:scale(.95);
      }

      .farm-plot.planted{
        background:linear-gradient(#66bb6a, #2e7d32);
      }

      .farm-plot.ready{
        background:linear-gradient(#aed581, #7cb342);
        box-shadow:0 0 10px rgba(174,213,129,.6);
      }

      .farm-info{
        margin-top:10px;
        font-size:12px;
        color:#888;
        text-align:center;
      }
    </style>

    <div class="home-wrapper">

      <div class="home-header">
        <h2>🌾 المزرعة</h2>
        <p>ازرع • انتظر • احصد</p>
      </div>

      <div class="home-stats">
        <div class="stat-card">
          <div class="value">0</div>
          <div class="label">النقاط</div>
        </div>
        <div class="stat-card">
          <div class="value">VIP 0</div>
          <div class="label">المستوى</div>
        </div>
      </div>

      <div class="game-box">
        <div class="farm-grid">
          ${farmState.plots.map((plot, index) => `
            <div
              class="farm-plot
                ${plot.planted ? "planted" : ""}
                ${plot.ready ? "ready" : ""}"
              data-index="${index}"
            >
              ${plot.ready ? "🌾" : plot.planted ? "🌱" : "🟫"}
            </div>
          `).join("")}
        </div>

        <div class="farm-info">
          اضغط على الأرض للزرع — اضغط مرة أخرى للحصاد
        </div>
      </div>

    </div>
  `;

  bindFarmEvents();
}

/* =====================================================
   Farm Events (Plant / Harvest)
===================================================== */
function bindFarmEvents(){
  const plots = document.querySelectorAll(".farm-plot");

  plots.forEach(plotEl => {
    plotEl.onclick = () => {
      const index = parseInt(plotEl.dataset.index);
      const plot = farmState.plots[index];

      // زرع
      if (!plot.planted) {
        plot.planted = true;
        plot.ready = true; // مؤقتًا بدون وقت
        renderHome();
        return;
      }

      // حصاد
      if (plot.ready) {
        plot.planted = false;
        plot.ready = false;
        renderHome();
        return;
      }
    };
  });
     }
