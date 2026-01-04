/* =====================================================
   WinHive Farm – Home Page (Real Farming System)
===================================================== */

/* ---------- Config ---------- */
const FARM_STORAGE_KEY = "winhive_farm_state_v1";
const TOTAL_PLOTS = 6;

/* ---------- Crops ---------- */
const CROPS = [
  { id: "wheat",  name: "قمح",  time: 300, icon: "🌾", reward: 2 },
  { id: "carrot", name: "جزر",  time: 600, icon: "🥕", reward: 3 },
  { id: "pepper", name: "فلفل", time: 900, icon: "🌶️", reward: 4 }
];

/* ---------- State ---------- */
let farmState = {
  points: 0,
  vip: 0,
  plots: []
};

/* ---------- Helpers ---------- */
function now() {
  return Math.floor(Date.now() / 1000);
}

/* ---------- Init ---------- */
function initFarm() {
  const saved = localStorage.getItem(FARM_STORAGE_KEY);
  if (saved) {
    farmState = JSON.parse(saved);
    return;
  }

  farmState.plots = [];
  for (let i = 0; i < TOTAL_PLOTS; i++) {
    farmState.plots.push({
      crop: null,
      plantedAt: 0,
      growTime: 0
    });
  }

  saveFarm();
}

function saveFarm() {
  localStorage.setItem(FARM_STORAGE_KEY, JSON.stringify(farmState));
}

/* ---------- Growth ---------- */
function plotStatus(plot) {
  if (!plot.crop) return { stage: "empty" };

  const elapsed = now() - plot.plantedAt;
  if (elapsed >= plot.growTime) {
    return { stage: "ready" };
  }

  if (elapsed > plot.growTime * 0.6) {
    return { stage: "growing2", remaining: plot.growTime - elapsed };
  }

  return { stage: "growing1", remaining: plot.growTime - elapsed };
}

/* ---------- Render ---------- */
window.renderHome = function () {
  initFarm();

  const content = document.getElementById("content");
  let html = `
    <style>
      .farm-wrap{max-width:420px;margin:auto}
      .farm-top{display:flex;justify-content:space-between;margin-bottom:10px}
      .farm-board{
        background:linear-gradient(#6dbb4f,#4e8f3a);
        border-radius:20px;
        padding:15px;
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:12px;
      }
      .plot{
        background:#5a3b1e;
        border-radius:14px;
        height:90px;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#fff;
        font-size:26px;
        position:relative;
        cursor:pointer;
      }
      .plot.locked{background:#333;cursor:not-allowed}
      .timer{
        position:absolute;
        top:-10px;
        background:rgba(0,0,0,.7);
        padding:2px 6px;
        border-radius:8px;
        font-size:11px;
      }
    </style>

    <div class="farm-wrap">
      <div class="farm-top">
        <div>💰 ${farmState.points}</div>
        <div>👑 VIP ${farmState.vip}</div>
      </div>

      <div class="farm-board">
  `;

  farmState.plots.forEach((plot, i) => {
    if (i > 0 && farmState.vip === 0) {
      html += `<div class="plot locked">🔒</div>`;
      return;
    }

    const status = plotStatus(plot);

    if (status.stage === "empty") {
      html += `<div class="plot" onclick="openPlantMenu(${i})">🟫</div>`;
    }

    if (status.stage === "growing1") {
      html += `
        <div class="plot">
          <div class="timer">${status.remaining}s</div>🌱
        </div>`;
    }

    if (status.stage === "growing2") {
      html += `
        <div class="plot">
          <div class="timer">${status.remaining}s</div>🌿
        </div>`;
    }

    if (status.stage === "ready") {
      html += `
        <div class="plot" onclick="harvest(${i})">
          🌾
        </div>`;
    }
  });

  html += `
      </div>
    </div>
  `;

  content.innerHTML = html;

  if (farmState.plots.some(p => p.crop)) {
    setTimeout(renderHome, 1000);
  }
};

/* ---------- Plant Menu ---------- */
window.openPlantMenu = function (index) {
  let menu = `
    <div id="plantMenu" style="
      position:fixed;inset:0;
      background:rgba(0,0,0,.8);
      display:flex;align-items:center;justify-content:center;
      z-index:9999">
      <div style="background:#111;padding:15px;border-radius:14px;text-align:center">
        <h3>اختر المحصول</h3>
  `;

  CROPS.forEach(c => {
    menu += `
      <button onclick="plant(${index},'${c.id}')"
        style="margin:5px;padding:8px 12px;border-radius:10px;border:none">
        ${c.icon} ${c.name}
      </button>`;
  });

  menu += `
        <br><br>
        <button onclick="closePlantMenu()">إلغاء</button>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", menu);
};

window.closePlantMenu = function () {
  document.getElementById("plantMenu")?.remove();
};

/* ---------- Actions ---------- */
window.plant = function (index, cropId) {
  const crop = CROPS.find(c => c.id === cropId);
  if (!crop) return;

  farmState.plots[index] = {
    crop: cropId,
    plantedAt: now(),
    growTime: crop.time
  };

  saveFarm();
  closePlantMenu();
  renderHome();
};

window.harvest = function (index) {
  const cropId = farmState.plots[index].crop;
  const crop = CROPS.find(c => c.id === cropId);
  if (!crop) return;

  farmState.points += crop.reward;
  farmState.plots[index] = { crop: null, plantedAt: 0, growTime: 0 };
  saveFarm();
  renderHome();
};
