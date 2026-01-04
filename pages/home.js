/* =====================================================
   WinHive — Home Page (Farm Game)
   FIXED VERSION — NO TEMPLATE ERRORS
===================================================== */

/* ================== CONSTANTS ================== */
const FARM_STORAGE_KEY = "winhive_farm_state_v3";
const TOTAL_PLOTS = 6;

/* ================== CROPS ================== */
const CROPS = [
  { id: "wheat",  name: "قمح",   time: 300, reward: 1, icon: "🌾" },
  { id: "carrot", name: "جزر",   time: 600, reward: 2, icon: "🥕" },
  { id: "pepper", name: "فلفل",  time: 900, reward: 3, icon: "🌶️" },
  { id: "grape",  name: "عنب",   time: 1200,reward: 4, icon: "🍇" },
  { id: "rocket", name: "جرجير", time: 1800,reward: 5, icon: "🥬" }
];

/* ================== STATE ================== */
let farmState = {
  points: 0,
  vip: 0,
  plots: []
};

/* ================== TIME ================== */
function now() {
  return Math.floor(Date.now() / 1000);
}

/* ================== STORAGE ================== */
function saveFarm() {
  localStorage.setItem(FARM_STORAGE_KEY, JSON.stringify(farmState));
}

function loadFarm() {
  const raw = localStorage.getItem(FARM_STORAGE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data.plots)) return false;
    farmState = data;
    return true;
  } catch {
    return false;
  }
}

/* ================== INIT ================== */
function initFarm() {
  if (!loadFarm()) {
    farmState.plots = [];
    for (let i = 0; i < TOTAL_PLOTS; i++) {
      farmState.plots.push({
        cropId: null,
        plantedAt: 0,
        growTime: 0
      });
    }
    saveFarm();
  }
}

/* ================== VIP ================== */
function isPlotUnlocked(index) {
  return index < (1 + farmState.vip);
}

/* ================== GAME LOGIC ================== */
function plant(plotIndex, cropId) {
  const plot = farmState.plots[plotIndex];
  const crop = CROPS.find(c => c.id === cropId);
  if (!plot || plot.cropId || !crop) return;

  plot.cropId = crop.id;
  plot.plantedAt = now();
  plot.growTime = crop.time;

  saveFarm();
  closePlantMenu();
  renderHome();
}

function harvest(plotIndex) {
  const plot = farmState.plots[plotIndex];
  if (!plot || !plot.cropId) return;

  const elapsed = now() - plot.plantedAt;
  if (elapsed < plot.growTime) return;

  const crop = CROPS.find(c => c.id === plot.cropId);
  if (crop) farmState.points += crop.reward;

  plot.cropId = null;
  plot.plantedAt = 0;
  plot.growTime = 0;

  saveFarm();
  renderHome();
}

/* ================== PLANT MENU ================== */
function openPlantMenu(index) {
  let html = `
  <div id="plantMenu" style="
    position:fixed;inset:0;
    background:rgba(0,0,0,.85);
    display:flex;justify-content:center;align-items:center;
    z-index:9999">
    <div style="
      background:#111;
      padding:16px;
      border-radius:14px;
      color:#fff;
      max-width:320px;
      width:100%;
      text-align:center">
      <h3>اختر محصول</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
  `;

  CROPS.forEach(c => {
    html += `
      <button
        onclick="plant(${index}, '${c.id}')"
        style="
          padding:10px;
          border-radius:10px;
          border:none;
          background:#222;
          color:#fff;
          min-width:90px">
        ${c.icon}<br>${c.name}<br>
        <small>${Math.floor(c.time/60)} دقيقة</small>
      </button>
    `;
  });

  html += `
      </div>
      <button onclick="closePlantMenu()"
        style="margin-top:12px;background:none;border:none;color:#aaa">
        إلغاء
      </button>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);
}

function closePlantMenu() {
  document.getElementById("plantMenu")?.remove();
}

/* ================== RENDER ================== */
function renderHome() {
  const content = document.getElementById("content");
  if (!content) return;

  let html = `
  <style>
    .farm{max-width:420px;margin:auto}
    .top{display:flex;justify-content:space-between;margin-bottom:10px}
    .board{
      background:linear-gradient(#6fbf55,#4e8f3a);
      border-radius:20px;
      padding:12px;
      position:relative;
      height:420px
    }
    .plot{
      position:absolute;
      width:90px;height:80px;
      border-radius:14px;
      background:#3e2a15;
      color:#fff;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow:inset 0 2px 4px rgba(255,255,255,.1),
                 0 4px 8px rgba(0,0,0,.4);
      cursor:pointer;
    }
    .plot.locked{background:#333;opacity:.6;cursor:not-allowed}
    .timer{
      position:absolute;
      top:-18px;
      background:#000;
      padding:2px 6px;
      border-radius:8px;
      font-size:11px;
    }
    .p0{top:30px;left:30px}
    .p1{top:30px;right:30px}
    .p2{top:170px;left:160px}
    .p3{bottom:170px;left:30px}
    .p4{bottom:170px;right:30px}
    .p5{bottom:30px;left:160px}
  </style>

  <div class="farm">
    <div class="top">
      <div>💰 ${farmState.points}</div>
      <div>👑 VIP ${farmState.vip}</div>
    </div>
    <div class="board">
  `;

  farmState.plots.forEach((plot, i) => {
    if (!isPlotUnlocked(i)) {
      html += `<div class="plot locked p${i}">🔒</div>`;
      return;
    }

    if (!plot.cropId) {
      html += `<div class="plot p${i}" onclick="openPlantMenu(${i})">🟫</div>`;
      return;
    }

    const remaining = plot.growTime - (now() - plot.plantedAt);

    if (remaining > 0) {
      html += `
        <div class="plot p${i}">
          <div class="timer">${remaining}s</div>🌱
        </div>
      `;
    } else {
      html += `
        <div class="plot p${i}" onclick="harvest(${i})">🌾</div>
      `;
    }
  });

  html += `</div></div>`;
  content.innerHTML = html;

  if (farmState.plots.some(p => p.cropId)) {
    setTimeout(renderHome, 1000);
  }
}

/* ================== BOOT ================== */
(function(){
  initFarm();
  renderHome();
})();

/* ================== EXPORT ================== */
window.renderHome = renderHome;
