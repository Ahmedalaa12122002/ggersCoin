/* =====================================================
   PART 0 — GLOBAL PAGE GUARD
   Prevent Home rendering outside Home page
===================================================== */

function isHomePageActive() {
  return (
    typeof window.__ACTIVE_PAGE__ === "undefined" ||
    window.__ACTIVE_PAGE__ === "home"
  );
}
/* =====================================================
   PART 1 — BASE SYSTEM (CONSTANTS + STATE + INIT)
   WinHive Farm Game
===================================================== */

/* ---------- Constants ---------- */
const STORAGE_KEY = "winhive_game_state_v1";
const TOTAL_PLOTS = 6;

/* ---------- Crops ---------- */
const CROPS = [
  { id: "wheat",  name: "قمح",   baseTime: 5,  baseReward: 1 },
  { id: "carrot", name: "جزر",   baseTime: 10, baseReward: 2 },
  { id: "pepper", name: "فلفل",  baseTime: 15, baseReward: 2 },
  { id: "grape",  name: "عنب",   baseTime: 20, baseReward: 3 },
  { id: "rocket", name: "جرجير", baseTime: 30, baseReward: 3 }
];

/* ---------- Global State ---------- */
let state = {
  points: 0,
  vipLevel: 0,
  plots: [],
  task: null
};

/* ---------- Time Helper ---------- */
function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

/* ---------- Init Plots ---------- */
function initPlots() {
  state.plots = [];
  for (let i = 0; i < TOTAL_PLOTS; i++) {
    state.plots.push({
      cropId: null,
      plantedAt: 0,
      growTime: 0
    });
  }
}

/* ---------- Storage ---------- */
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.plots)) return false;
    state = parsed;
    return true;
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }
}

/* ---------- Game Init ---------- */
function initGame() {
  const loaded = loadState();
  if (!loaded || state.plots.length !== TOTAL_PLOTS) {
    initPlots();
    saveState();
  }
   }
/* =====================================================
   PART 2 — GAME LOGIC (PLANT / GROW / HARVEST)
===================================================== */

function getCropById(cropId) {
  return CROPS.find(c => c.id === cropId) || null;
}

function plantCrop(plotIndex, cropId, growTimeSeconds) {
  const plot = state.plots[plotIndex];
  if (!plot || plot.cropId !== null) return false;

  plot.cropId = cropId;
  plot.plantedAt = nowSeconds();
  plot.growTime = growTimeSeconds;

  saveState();
  return true;
}

function getPlotGrowthStatus(plotIndex) {
  const plot = state.plots[plotIndex];
  if (!plot || !plot.cropId) return { status: "empty" };

  const elapsed = nowSeconds() - plot.plantedAt;
  const remaining = Math.max(0, plot.growTime - elapsed);
  const progress = Math.min(1, elapsed / plot.growTime);

  if (elapsed >= plot.growTime) {
    return { status: "ready", remaining: 0, progress: 1 };
  }

  return { status: "growing", remaining, progress };
}

function harvestPlot(plotIndex) {
  const plot = state.plots[plotIndex];
  if (!plot || !plot.cropId) return 0;

  const status = getPlotGrowthStatus(plotIndex);
  if (status.status !== "ready") return 0;

  const crop = getCropById(plot.cropId);
  const reward = crop ? crop.baseReward : 0;

  state.points += reward;
  plot.cropId = null;
  plot.plantedAt = 0;
  plot.growTime = 0;

  saveState();
  return reward;
}
/* =====================================================
   PART 3 — VIP SYSTEM
===================================================== */

function getVipConfig(level) {
  return {
    unlockedPlots: Math.min(1 + level, TOTAL_PLOTS),
    speedReduction: level * 0.05,
    taskBonus: level * 0.10
  };
}

function isPlotUnlocked(plotIndex) {
  return plotIndex < getVipConfig(state.vipLevel).unlockedPlots;
}

function calculateGrowTime(baseTimeSeconds) {
  const reduced = baseTimeSeconds * (1 - getVipConfig(state.vipLevel).speedReduction);
  return Math.max(1, Math.round(reduced));
}
/* =====================================================
   PART 4 — TASK SYSTEM
===================================================== */

const TASK_POOL = [
  { id: "harvest_any_5", type: "harvest_any", target: 5, baseReward: 5 },
  { id: "plant_wheat_3", type: "plant_crop", cropId: "wheat", target: 3, baseReward: 4 }
];

function generateNewTask() {
  const t = TASK_POOL[Math.floor(Math.random() * TASK_POOL.length)];
  state.task = { ...t, progress: 0 };
  saveState();
}

function getTaskText() {
  if (!state.task) return "";
  return state.task.type === "harvest_any"
    ? `🌾 احصد ${state.task.target} مرات`
    : `🌱 ازرع ${getCropById(state.task.cropId).name}`;
}

function onPlantForTask(cropId) {
  if (!state.task) return;
  if (state.task.type === "plant_crop" && state.task.cropId === cropId) {
    state.task.progress++;
    saveState();
  }
}

function onHarvestForTask() {
  if (!state.task) return;
  if (state.task.type === "harvest_any") {
    state.task.progress++;
    saveState();
  }
   }
/* =====================================================
   PART 5 — RENDER HOME (SAFE)
===================================================== */

function renderHome() {
  if (!isHomePageActive()) return;

  const content = document.getElementById("content");
  if (!content) return;

  if (!state.task) generateNewTask();

  let html = `<div style="padding:12px">
    <h3>🌾 WinHive Farm</h3>
    <div>💰 ${state.points} | 👑 VIP ${state.vipLevel}</div>
    <div>${getTaskText()}</div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:10px">`;

  state.plots.forEach((plot, i) => {
    if (!isPlotUnlocked(i)) {
      html += `<div style="background:#333;padding:20px">🔒 VIP</div>`;
      return;
    }

    if (!plot.cropId) {
      html += `<div onclick="uiOpenPlantMenu(${i})" style="background:#2e5b2e;padding:20px">🟫 أرض</div>`;
      return;
    }

    const status = getPlotGrowthStatus(i);
    if (status.status === "growing") {
      html += `<div style="background:#654321;padding:20px">🌱 ${status.remaining}s</div>`;
    } else {
      html += `<div onclick="uiHarvest(${i})" style="background:#4caf50;padding:20px">🌾 حصاد</div>`;
    }
  });

  html += `</div></div>`;
  content.innerHTML = html;

  if (state.plots.some((p, i) => p.cropId && getPlotGrowthStatus(i).status === "growing")) {
    setTimeout(() => {
      if (isHomePageActive()) renderHome();
    }, 1000);
  }
     }
/* =====================================================
   PART 6 — UI ACTIONS + SAFE START
===================================================== */

function uiOpenPlantMenu(plotIndex) {
  let menu = `<div id="plantMenu" style="position:fixed;inset:0;background:#000c">
    <div style="background:#111;padding:12px;margin:40px auto;width:280px">`;

  CROPS.forEach(crop => {
    const time = calculateGrowTime(crop.baseTime);
    menu += `<button onclick="uiPlant(${plotIndex},'${crop.id}',${time})">
      ${crop.name} (${time}s)
    </button><br>`;
  });

  menu += `<button onclick="uiClosePlantMenu()">إلغاء</button></div></div>`;
  document.body.insertAdjacentHTML("beforeend", menu);
}

function uiClosePlantMenu() {
  document.getElementById("plantMenu")?.remove();
}

function uiPlant(plotIndex, cropId, growTime) {
  if (plantCrop(plotIndex, cropId, growTime)) {
    onPlantForTask(cropId);
    uiClosePlantMenu();
    renderHome();
  }
}

function uiHarvest(plotIndex) {
  if (harvestPlot(plotIndex) > 0) {
    onHarvestForTask();
    renderHome();
  }
}

(function safeStart(){
  document.addEventListener("DOMContentLoaded", () => {
    initGame();
    if (!state.task) generateNewTask();
    renderHome();
  });
})();
