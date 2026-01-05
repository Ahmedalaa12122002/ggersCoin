/* =====================================================
   Home Page
   File: pages/home.page.js
   Responsibility:
   - Render Home Screen content ONLY
   - Farm game with real timers
   - Crop selection
   - Enhanced realistic visuals
   - Stable & extendable
===================================================== */

/* ---------- Crops ---------- */
const CROPS = [
  { id: "wheat",  name: "قمح",   icon: "🌾", time: 5  },
  { id: "corn",   name: "ذرة",   icon: "🌽", time: 10 },
  { id: "carrot", name: "جزر",   icon: "🥕", time: 15 },
  { id: "tomato", name: "طماطم", icon: "🍅", time: 20 },
  { id: "grape",  name: "عنب",   icon: "🍇", time: 25 }
];

/* ---------- Farm State ---------- */
const farmState = {
  plots: Array.from({ length: 12 }, () => ({
    planted: false,
    crop: null,
    startTime: 0,
    duration: 0
  })),
  selectingPlot: null
};

/* ---------- Time Helper ---------- */
function now() {
  return Math.floor(Date.now() / 1000);
}

/* =====================================================
   Render Home
===================================================== */
function renderHome() {
  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = `
    <style>
      /* ---------- Layout ---------- */
      .home-wrapper{
        padding:16px;
        max-width:480px;
        margin:0 auto;
      }

      .home-header{
        text-align:center;
        margin-bottom:12px;
      }
      .home-header h2{
        margin:0;
        font-size:22px;
        color:#ffd54f;
      }
      .home-header p{
        font-size:13px;
        color:#aaa;
      }

      .home-stats{
        display:flex;
        gap:10px;
        margin-bottom:14px;
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
      }

      /* ---------- Game Box ---------- */
      .game-box{
        background:
          linear-gradient(#2e7d32,#1b5e20);
        border-radius:18px;
        padding:14px;
        box-shadow:
          inset 0 0 30px rgba(0,0,0,.4),
          0 8px 24px rgba(0,0,0,.5);
      }

      /* ---------- Farm Grid ---------- */
      .farm-grid{
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:12px;
      }

      /* ---------- Plot ---------- */
      .farm-plot{
        position:relative;
        height:90px;
        border-radius:16px;
        background:
          radial-gradient(circle at top,#6d4c41,#3e2723);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:28px;
        cursor:pointer;
        overflow:hidden;
        box-shadow:
          inset 0 3px 6px rgba(255,255,255,.08),
          inset 0 -4px 8px rgba(0,0,0,.6),
          0 4px 10px rgba(0,0,0,.5);
        transition:transform .15s ease;
      }

      .farm-plot:active{
        transform:scale(.95);
      }

      .farm-plot.ready{
        background:
          radial-gradient(circle at top,#9ccc65,#558b2f);
      }

      /* ---------- Plant ---------- */
      .plant{
        z-index:2;
        animation:growPulse 2s ease-in-out infinite alternate;
      }

      @keyframes growPulse{
        from{ transform:scale(.95); }
        to{ transform:scale(1.05); }
      }

      /* ---------- Timer ---------- */
      .timer{
        position:absolute;
        top:6px;
        background:rgba(0,0,0,.65);
        padding:2px 6px;
        border-radius:8px;
        font-size:11px;
        z-index:3;
      }

      /* ---------- Progress ---------- */
      .progress-bar{
        position:absolute;
        bottom:0;
        left:0;
        height:7px;
        width:0%;
        background:
          linear-gradient(
            90deg,
            #ff5252 0%,
            #ffca28 50%,
            #66bb6a 100%
          );
        transition:width .4s linear;
      }

      /* ---------- Crop Selector ---------- */
      .crop-selector{
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.85);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:9999;
      }

      .crop-box{
        background:#111;
        padding:16px;
        border-radius:18px;
        width:300px;
        text-align:center;
        box-shadow:0 0 20px rgba(0,0,0,.6);
      }

      .crop-list{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        justify-content:center;
      }

      .crop-btn{
        background:#1a1a1a;
        border:none;
        border-radius:14px;
        padding:10px;
        width:90px;
        color:#fff;
        cursor:pointer;
        transition:transform .15s ease;
      }
      .crop-btn:active{
        transform:scale(.95);
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
          ${farmState.plots.map((plot,i)=>{
            const elapsed = plot.planted ? now() - plot.startTime : 0;
            const remaining = plot.planted
              ? Math.max(0, plot.duration - elapsed)
              : 0;
            const progress = plot.planted
              ? Math.min(100,(elapsed / plot.duration) * 100)
              : 0;
            const ready = plot.planted && remaining === 0;

            return `
              <div class="farm-plot ${ready?"ready":""}" data-index="${i}">
                <div class="plant">
                  ${plot.planted
                    ? (ready ? plot.crop.icon : "🌱")
                    : "🟫"}
                </div>
                ${plot.planted && !ready
                  ? `<div class="timer">${remaining}s</div>`
                  : ""}
                ${plot.planted
                  ? `<div class="progress-bar" style="width:${progress}%"></div>`
                  : ""}
              </div>
            `;
          }).join("")}
        </div>
      </div>

    </div>
  `;

  bindFarmEvents();

  if (farmState.plots.some(p => p.planted && now() - p.startTime < p.duration)) {
    setTimeout(renderHome, 1000);
  }
}

/* =====================================================
   Farm Events
===================================================== */
function bindFarmEvents(){
  document.querySelectorAll(".farm-plot").forEach(el=>{
    el.onclick = ()=>{
      const index = parseInt(el.dataset.index);
      const plot = farmState.plots[index];

      if (plot.planted && now() - plot.startTime >= plot.duration) {
        plot.planted = false;
        plot.crop = null;
        plot.startTime = 0;
        plot.duration = 0;
        renderHome();
        return;
      }

      if (!plot.planted) {
        farmState.selectingPlot = index;
        openCropSelector();
      }
    };
  });
}

/* =====================================================
   Crop Selector
===================================================== */
function openCropSelector(){
  const overlay = document.createElement("div");
  overlay.className = "crop-selector";

  overlay.innerHTML = `
    <div class="crop-box">
      <h3>اختر المحصول</h3>
      <div class="crop-list">
        ${CROPS.map(c=>`
          <button class="crop-btn" data-id="${c.id}">
            ${c.icon}<br>${c.name}<br><small>${c.time}s</small>
          </button>
        `).join("")}
      </div>
    </div>
  `;

  overlay.onclick = e=>{
    if(e.target === overlay) overlay.remove();
  };

  overlay.querySelectorAll(".crop-btn").forEach(btn=>{
    btn.onclick = ()=>{
      const crop = CROPS.find(c=>c.id===btn.dataset.id);
      const plot = farmState.plots[farmState.selectingPlot];

      plot.planted = true;
      plot.crop = crop;
      plot.startTime = now();
      plot.duration = crop.time;

      farmState.selectingPlot = null;
      overlay.remove();
      renderHome();
    };
  });

  document.body.appendChild(overlay);
}
