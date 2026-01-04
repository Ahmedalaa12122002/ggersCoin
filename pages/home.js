/* =====================================================
   WinHive Farm – Home Page (Harvest Animation Added)
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
    farmState.plots.push({ crop: null, plantedAt: 0, growTime: 0 });
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
  const remain = plot.growTime - elapsed;
  if (elapsed >= plot.growTime) return { stage: "ready" };
  if (elapsed > plot.growTime * 0.65) return { stage: "growing2", remaining: remain };
  return { stage: "growing1", remaining: remain };
}

/* ---------- Render ---------- */
window.renderHome = function () {
  initFarm();
  const content = document.getElementById("content");

  let html = `
  <style>
    .farm-wrap{max-width:420px;margin:auto}
    .farm-top{display:flex;justify-content:space-between;margin-bottom:10px;font-size:14px}

    .farm-board{
      background:linear-gradient(#6dbb4f,#4e8f3a);
      border-radius:22px;padding:14px;
      display:grid;grid-template-columns:repeat(3,1fr);
      gap:14px;box-shadow:inset 0 0 25px rgba(0,0,0,.4);
    }

    .plot{
      position:relative;height:92px;border-radius:16px;
      background:linear-gradient(#5a3b1e,#3b2614);
      display:flex;align-items:center;justify-content:center;
      font-size:28px;cursor:pointer;
      box-shadow:inset 0 2px 3px rgba(255,255,255,.08),
                 inset 0 -3px 6px rgba(0,0,0,.45),
                 0 4px 8px rgba(0,0,0,.35);
      transition:transform .15s ease, box-shadow .2s ease;
      overflow:hidden;
    }
    .plot:active{transform:scale(.95)}
    .plot.locked{background:#333;cursor:not-allowed;opacity:.6}

    .soil{
      position:absolute;bottom:0;left:0;right:0;height:38%;
      background:linear-gradient(#3e2a15,#2a1c0f);
      border-radius:0 0 16px 16px;
    }

    .plant{z-index:2;animation:pulse 2.5s ease-in-out infinite alternate}
    @keyframes pulse{from{transform:scale(.96)}to{transform:scale(1.05)}}

    .timer{
      position:absolute;top:-12px;background:rgba(0,0,0,.75);
      padding:2px 6px;border-radius:8px;font-size:11px;
      box-shadow:0 2px 6px rgba(0,0,0,.6)
    }

    /* Ready Glow */
    .ready{
      box-shadow:
        0 0 12px rgba(255,215,0,.45),
        0 0 24px rgba(255,215,0,.2),
        inset 0 -3px 6px rgba(0,0,0,.45);
    }

    /* Harvest animation */
    .harvested{
      animation:harvestOut .45s ease forwards;
    }
    @keyframes harvestOut{
      to{opacity:0;transform:scale(.7)}
    }

    /* Floating reward */
    .reward{
      position:absolute;top:50%;left:50%;
      transform:translate(-50%,-50%);
      color:#ffd54a;font-size:14px;font-weight:bold;
      animation:floatUp .8s ease forwards;z-index:5;
    }
    @keyframes floatUp{
      to{opacity:0;transform:translate(-50%,-90%)}
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
      html += `<div class="plot" onclick="openPlantMenu(${i})"><div class="soil"></div>🟫</div>`;
    }
    if (status.stage === "growing1") {
      html += `<div class="plot"><div class="timer">${status.remaining}s</div><div class="soil"></div><div class="plant">🌱</div></div>`;
    }
    if (status.stage === "growing2") {
      html += `<div class="plot"><div class="timer">${status.remaining}s</div><div class="soil"></div><div class="plant">🌿</div></div>`;
    }
    if (status.stage === "ready") {
      html += `<div class="plot ready" onclick="harvest(${i}, this)"><div class="soil"></div><div class="plant">🌾</div></div>`;
    }
  });

  html += `</div></div>`;
  content.innerHTML = html;

  if (farmState.plots.some(p => p.crop)) setTimeout(renderHome, 1000);
};

/* ---------- Plant Menu ---------- */
window.openPlantMenu = function (index) {
  let menu = `
  <div id="plantMenu" style="position:fixed;inset:0;background:rgba(0,0,0,.85);
    display:flex;align-items:center;justify-content:center;z-index:9999">
    <div style="background:#111;padding:16px;border-radius:14px;text-align:center">
      <h3>اختر المحصول</h3>
  `;
  CROPS.forEach(c => {
    menu += `<button onclick="plant(${index},'${c.id}')"
      style="margin:6px;padding:8px 14px;border:none;border-radius:10px;background:#222;color:#fff">
      ${c.icon} ${c.name}</button>`;
  });
  menu += `<br><br><button onclick="closePlantMenu()" style="background:none;border:none;color:#aaa">إلغاء</button></div></div>`;
  document.body.insertAdjacentHTML("beforeend", menu);
};
window.closePlantMenu = function () {
  document.getElementById("plantMenu")?.remove();
};

/* ---------- Actions ---------- */
window.plant = function (index, cropId) {
  const crop = CROPS.find(c => c.id === cropId);
  if (!crop) return;
  farmState.plots[index] = { crop: cropId, plantedAt: now(), growTime: crop.time };
  saveFarm(); closePlantMenu(); renderHome();
};

window.harvest = function (index, el) {
  const cropId = farmState.plots[index].crop;
  const crop = CROPS.find(c => c.id === cropId);
  if (!crop) return;

  // Visual feedback
  el.classList.add("harvested");
  const reward = document.createElement("div");
  reward.className = "reward";
  reward.textContent = `+${crop.reward}`;
  el.appendChild(reward);

  setTimeout(() => {
    farmState.points += crop.reward;
    farmState.plots[index] = { crop: null, plantedAt: 0, growTime: 0 };
    saveFarm();
    renderHome();
  }, 450);
};
