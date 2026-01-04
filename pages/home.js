/* =====================================================
   home.page.js
   WinHive – Farm System (Standalone)
===================================================== */

/* ---------- Constants ---------- */
const FARM_KEY = "winhive_farm_v1";
const TOTAL_PLOTS = 6;

/* ---------- Crops (3 فقط) ---------- */
const CROPS = [
  { id: "wheat",  name: "قمح",  time: 60,  reward: 1, icon: "🌾" },
  { id: "carrot", name: "جزر",  time: 120, reward: 2, icon: "🥕" },
  { id: "pepper", name: "فلفل", time: 180, reward: 3, icon: "🌶️" }
];

/* ---------- State ---------- */
let farmState = {
  points: 0,
  vip: 0,
  plots: []
};

/* ---------- Time ---------- */
function now() {
  return Math.floor(Date.now() / 1000);
}

/* ---------- Init ---------- */
function initFarm() {
  farmState.plots = [];
  for (let i = 0; i < TOTAL_PLOTS; i++) {
    farmState.plots.push({
      crop: null,
      plantedAt: 0,
      growTime: 0
    });
  }
}

/* ---------- Storage ---------- */
function saveFarm() {
  localStorage.setItem(FARM_KEY, JSON.stringify(farmState));
}

function loadFarm() {
  const raw = localStorage.getItem(FARM_KEY);
  if (!raw) return false;
  try {
    farmState = JSON.parse(raw);
    return true;
  } catch {
    return false;
  }
}

/* ---------- Plot Access ---------- */
function isPlotUnlocked(index) {
  return index === 0 || index < farmState.vip + 1;
}

/* ---------- Growth ---------- */
function getStatus(plot) {
  if (!plot.crop) return "empty";
  const elapsed = now() - plot.plantedAt;
  if (elapsed >= plot.growTime) return "ready";
  return "growing";
}

function remainingTime(plot) {
  const elapsed = now() - plot.plantedAt;
  return Math.max(0, plot.growTime - elapsed);
}

/* =====================================================
   RENDER HOME
===================================================== */

function renderHome() {
  const content = document.getElementById("content");
  if (!content) return;

  if (!loadFarm()) {
    initFarm();
    saveFarm();
  }

  let html = `
  <style>
    .farm-box{max-width:420px;margin:auto;color:#fff}
    .top{display:flex;justify-content:space-between;margin:10px}
    .board{background:#3b7a2a;border-radius:18px;padding:15px}
    .plots{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    .plot{
      background:#5a3b1e;
      border-radius:14px;
      height:90px;
      display:flex;
      align-items:center;
      justify-content:center;
      position:relative;
      font-size:22px;
      cursor:pointer;
    }
    .plot.locked{background:#333;cursor:not-allowed}
    .timer{position:absolute;bottom:6px;font-size:11px;color:#ff0}
    .btn{
      margin-top:15px;
      width:100%;
      padding:12px;
      background:#222;
      color:#fff;
      border:none;
      border-radius:14px;
      font-size:16px;
    }
  </style>

  <div class="farm-box">
    <div class="top">
      <div>💰 ${farmState.points}</div>
      <div>👑 VIP ${farmState.vip}</div>
    </div>

    <div class="board">
      <div class="plots">
  `;

  farmState.plots.forEach((plot, i) => {
    if (!isPlotUnlocked(i)) {
      html += `<div class="plot locked">🔒</div>`;
      return;
    }

    const status = getStatus(plot);

    if (status === "empty") {
      html += `<div class="plot" onclick="openPlant(${i})">🟫</div>`;
    }

    if (status === "growing") {
      html += `
        <div class="plot">
          🌱
          <div class="timer">${remainingTime(plot)}s</div>
        </div>`;
    }

    if (status === "ready") {
      html += `<div class="plot" onclick="harvest(${i})">🌾</div>`;
    }
  });

  html += `
      </div>
      <button class="btn">المزرعة تعمل تلقائيًا 🌱</button>
    </div>
  </div>
  `;

  content.innerHTML = html;

  // تحديث تلقائي
  if (farmState.plots.some(p => getStatus(p) === "growing")) {
    setTimeout(renderHome, 1000);
  }
}

/* =====================================================
   ACTIONS
===================================================== */

function openPlant(index) {
  const crop = CROPS[0]; // محصول واحد بزر واحد
  const plot = farmState.plots[index];

  plot.crop = crop;
  plot.plantedAt = now();
  plot.growTime = crop.time;

  saveFarm();
  renderHome();
}

function harvest(index) {
  const plot = farmState.plots[index];
  if (!plot.crop) return;

  farmState.points += plot.crop.reward;
  plot.crop = null;
  plot.plantedAt = 0;
  plot.growTime = 0;

  saveFarm();
  renderHome();
     }
