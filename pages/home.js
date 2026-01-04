/* =====================================================
   SECTION A — CONSTANTS + STATE + INIT
   (DO NOT DUPLICATE — DO NOT MODIFY LATER)
===================================================== */

/* ---------- Constants ---------- */
const STORAGE_KEY = "winhive_game_state_v1";
const TOTAL_PLOTS = 6;

/* ---------- Crops Definition ---------- */
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
  vipLevel: 0,          // 0 → 5
  plots: [],            // سيتم تهيئتها
  task: null            // للمهام لاحقًا
};

/* ---------- Initialize Plots ---------- */
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

/* ---------- Storage Helpers ---------- */
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    state = JSON.parse(raw);
    return true;
  } catch (e) {
    console.error("State load failed, resetting.", e);
    return false;
  }
}

/* ---------- App Init ---------- */
function initGame() {
  const loaded = loadState();
  if (!loaded || !Array.isArray(state.plots) || state.plots.length !== TOTAL_PLOTS) {
    initPlots();
    saveState();
  }
                     }
/* =====================================================
   SECTION B — GAME LOGIC (PLANT / GROW / HARVEST)
   (ADD BELOW SECTION A — DO NOT DUPLICATE)
===================================================== */

/* ---------- Helpers ---------- */
function getCropById(cropId) {
  return CROPS.find(c => c.id === cropId) || null;
}

function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

/* ---------- Planting ---------- */
/**
 * يزرع محصولًا في أرض محددة
 * @param {number} plotIndex
 * @param {string} cropId
 * @param {number} growTimeSeconds (محسوب لاحقًا مع VIP)
 */
function plantCrop(plotIndex, cropId, growTimeSeconds) {
  const plot = state.plots[plotIndex];
  if (!plot) return false;
  if (plot.cropId !== null) return false; // الأرض مش فاضية

  plot.cropId = cropId;
  plot.plantedAt = nowSeconds();
  plot.growTime = growTimeSeconds;

  saveState();
  return true;
}

/* ---------- Growth Status ---------- */
/**
 * يحسب حالة النمو للأرض
 * @returns {object} { status, elapsed, remaining, progress }
 */
function getPlotGrowthStatus(plotIndex) {
  const plot = state.plots[plotIndex];
  if (!plot || !plot.cropId) {
    return { status: "empty" };
  }

  const elapsed = nowSeconds() - plot.plantedAt;
  const remaining = Math.max(0, plot.growTime - elapsed);
  const progress = Math.min(1, elapsed / plot.growTime);

  if (elapsed >= plot.growTime) {
    return {
      status: "ready",
      elapsed,
      remaining: 0,
      progress: 1
    };
  }

  return {
    status: "growing",
    elapsed,
    remaining,
    progress
  };
}

/* ---------- Harvest ---------- */
/**
 * يحصد الأرض لو جاهزة
 * @returns {number} النقاط المكتسبة أو 0
 */
function harvestPlot(plotIndex) {
  const plot = state.plots[plotIndex];
  if (!plot || !plot.cropId) return 0;

  const status = getPlotGrowthStatus(plotIndex);
  if (status.status !== "ready") return 0;

  const crop = getCropById(plot.cropId);
  const reward = crop ? crop.baseReward : 0;

  // إضافة النقاط
  state.points += reward;

  // تفريغ الأرض
  plot.cropId = null;
  plot.plantedAt = 0;
  plot.growTime = 0;

  saveState();
  return reward;
     }
/* =====================================================
   SECTION C — VIP SYSTEM (LOGIC ONLY)
   (ADD BELOW SECTION B — DO NOT DUPLICATE)
===================================================== */

/* ---------- VIP Helpers ---------- */

/**
 * يعيد إعدادات VIP حسب المستوى
 * @param {number} level
 * @returns {object}
 */
function getVipConfig(level) {
  return {
    level,
    unlockedPlots: Math.min(1 + level, TOTAL_PLOTS), // أرض واحدة + كل VIP
    speedReduction: level * 0.05, // 5% لكل مستوى
    taskBonus: level * 0.10       // سيُستخدم لاحقًا
  };
}

/**
 * هل الأرض مفتوحة للمستخدم حسب VIP؟
 * @param {number} plotIndex
 * @returns {boolean}
 */
function isPlotUnlocked(plotIndex) {
  const vip = getVipConfig(state.vipLevel);
  return plotIndex < vip.unlockedPlots;
}

/**
 * يحسب وقت الزراعة بعد خصم VIP
 * @param {number} baseTimeSeconds
 * @returns {number}
 */
function calculateGrowTime(baseTimeSeconds) {
  const vip = getVipConfig(state.vipLevel);
  const reduced = baseTimeSeconds * (1 - vip.speedReduction);
  return Math.max(1, Math.round(reduced));
}

/* ---------- VIP Mutations ---------- */

/**
 * يغيّر مستوى VIP (للاختبار الآن)
 * لاحقًا سيتم ربطه بالشراء
 * @param {number} newLevel
 */
function setVipLevel(newLevel) {
  const level = Math.max(0, Math.min(5, newLevel));
  state.vipLevel = level;
  saveState();
}

/**
 * ترقية VIP بمستوى واحد
 */
function upgradeVip() {
  if (state.vipLevel < 5) {
    state.vipLevel += 1;
    saveState();
  }
}
/* =====================================================
   SECTION D — TASK SYSTEM (LOGIC ONLY)
   (ADD BELOW SECTION C — DO NOT DUPLICATE)
===================================================== */

/* ---------- Task Definitions ---------- */
const TASK_POOL = [
  { id: "harvest_any_5", type: "harvest_any", target: 5, baseReward: 5 },
  { id: "harvest_any_10", type: "harvest_any", target: 10, baseReward: 8 },
  { id: "plant_wheat_3", type: "plant_crop", cropId: "wheat", target: 3, baseReward: 3 },
  { id: "plant_carrot_2", type: "plant_crop", cropId: "carrot", target: 2, baseReward: 4 }
];

/* ---------- Task Helpers ---------- */

/**
 * يولّد مهمة عشوائية جديدة
 */
function generateNewTask() {
  const t = TASK_POOL[Math.floor(Math.random() * TASK_POOL.length)];
  state.task = {
    id: t.id,
    type: t.type,
    cropId: t.cropId || null,
    target: t.target,
    progress: 0,
    baseReward: t.baseReward
  };
  saveState();
}

/**
 * يعيد نص المهمة الحالي
 * (يُستخدم لاحقًا في الواجهة)
 */
function getTaskText() {
  const t = state.task;
  if (!t) return "";

  if (t.type === "harvest_any") {
    return `🌾 احصد ${t.target} مرات (${t.progress}/${t.target})`;
  }

  if (t.type === "plant_crop") {
    const crop = getCropById(t.cropId);
    return `🌱 ازرع ${crop ? crop.name : ""} ${t.target} مرات (${t.progress}/${t.target})`;
  }

  return "";
}

/* ---------- Task Progress ---------- */

/**
 * يتم استدعاؤه بعد أي زرع
 */
function onPlantForTask(cropId) {
  const t = state.task;
  if (!t) return;

  if (t.type === "plant_crop" && t.cropId === cropId) {
    t.progress += 1;
    checkTaskCompletion();
  }
}

/**
 * يتم استدعاؤه بعد أي حصاد
 */
function onHarvestForTask() {
  const t = state.task;
  if (!t) return;

  if (t.type === "harvest_any") {
    t.progress += 1;
    checkTaskCompletion();
  }
}

/* ---------- Completion ---------- */
function checkTaskCompletion() {
  const t = state.task;
  if (!t) return;

  if (t.progress >= t.target) {
    const vip = getVipConfig(state.vipLevel);
    const finalReward = Math.round(t.baseReward * (1 + vip.taskBonus));

    state.points += finalReward;

    // توليد مهمة جديدة
    generateNewTask();
  }

  saveState();
}
/* =====================================================
   SECTION E — RENDER + UI
   (ADD BELOW SECTION D — DO NOT DUPLICATE)
===================================================== */

/* ---------- Render Home ---------- */
function renderHome() {
  const content = document.getElementById("content");
  if (!content) return;

  const now = nowSeconds();
  const vip = getVipConfig(state.vipLevel);

  let html = `
  <style>
    .farm-wrapper{
      max-width:440px;
      margin:0 auto;
      padding:10px;
    }
    .top-bar{
      display:flex;
      justify-content:space-between;
      margin-bottom:8px;
      font-size:14px;
    }
    .task-box{
      background:#111;
      color:#fff;
      padding:8px;
      border-radius:12px;
      text-align:center;
      margin-bottom:10px;
      font-size:13px;
    }
    .farm-board{
      position:relative;
      width:100%;
      height:420px;
      background:linear-gradient(#6dbb4f,#4e8f3a);
      border-radius:20px;
      box-shadow:inset 0 0 30px rgba(0,0,0,.4);
    }
    .plot{
      position:absolute;
      width:100px;
      height:90px;
      border-radius:14px;
      background:linear-gradient(#5a3b1e,#3e2a15);
      box-shadow:inset 0 3px 6px rgba(0,0,0,.4);
      display:flex;
      justify-content:center;
      align-items:center;
      color:#fff;
      font-size:26px;
      cursor:pointer;
    }
    .plot.locked{
      background:linear-gradient(#444,#222);
      opacity:.8;
      cursor:not-allowed;
    }
    .soil{
      position:absolute;
      bottom:0;
      width:100%;
      height:35%;
      background:linear-gradient(#3e2a15,#2a1c0f);
      border-radius:0 0 14px 14px;
    }
    .plant{
      font-size:28px;
      z-index:2;
    }
    .timer{
      position:absolute;
      top:-18px;
      background:rgba(0,0,0,.75);
      padding:2px 6px;
      border-radius:8px;
      font-size:11px;
      z-index:3;
    }

    /* توزيع الأراضي */
    .p0{ top:40px;  left:40px; }
    .p1{ top:40px;  right:40px; }
    .p2{ top:160px; left:160px; }
    .p3{ bottom:160px; left:40px; }
    .p4{ bottom:160px; right:40px; }
    .p5{ bottom:40px;  left:160px; }
  </style>

  <div class="farm-wrapper">
    <div class="top-bar">
      <div>💰 ${state.points}</div>
      <div>👑 VIP ${state.vipLevel}</div>
    </div>

    <div class="task-box">
      <strong>📌 المهمة الحالية</strong><br>
      ${getTaskText()}
    </div>

    <div class="farm-board">
  `;

  state.plots.forEach((plot, index) => {
    if (!isPlotUnlocked(index)) {
      html += `<div class="plot locked p${index}">🔒</div>`;
      return;
    }

    if (!plot.cropId) {
      html += `
        <div class="plot p${index}" onclick="uiOpenPlantMenu(${index})">
          <div class="soil"></div>🟫
        </div>`;
      return;
    }

    const status = getPlotGrowthStatus(index);

    if (status.status === "growing") {
      const stage = status.progress > 0.5 ? "🌿" : "🌱";
      html += `
        <div class="plot p${index}">
          <div class="timer">${status.remaining}s</div>
          <div class="soil"></div>
          <div class="plant">${stage}</div>
        </div>`;
    }

    if (status.status === "ready") {
      html += `
        <div class="plot p${index}" onclick="uiHarvest(${index})">
          <div class="soil"></div>
          <div class="plant">🌾</div>
        </div>`;
    }
  });

  html += `
    </div>
  </div>
  `;

  content.innerHTML = html;

  // تحديث تلقائي أثناء النمو
  if (state.plots.some((p, i) => p.cropId && getPlotGrowthStatus(i).status === "growing")) {
    setTimeout(renderHome, 1000);
  }
}

/* ---------- UI Actions ---------- */

function uiOpenPlantMenu(plotIndex) {
  let menu = `
  <div id="plantMenu" style="
    position:fixed;inset:0;
    background:rgba(0,0,0,.85);
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:9999">
    <div style="
      background:#111;
      padding:14px;
      border-radius:14px;
      color:#fff;
      text-align:center;
      max-width:300px;
      width:100%">
      <h3>اختر محصول</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">
  `;

  CROPS.forEach(crop => {
    const growTime = calculateGrowTime(crop.baseTime);
    menu += `
      <button onclick="uiPlant(${plotIndex},'${crop.id}',${growTime})"
        style="padding:8px 12px;border:none;border-radius:10px;
        background:#222;color:#fff;font-size:12px">
        ${crop.name}<br><small>${growTime}ث</small>
      </button>`;
  });

  menu += `
      </div>
      <button onclick="uiClosePlantMenu()"
        style="margin-top:10px;background:none;border:none;color:#aaa">
        إلغاء
      </button>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", menu);
}

function uiClosePlantMenu() {
  document.getElementById("plantMenu")?.remove();
}

function uiPlant(plotIndex, cropId, growTime) {
  const ok = plantCrop(plotIndex, cropId, growTime);
  if (ok) {
    onPlantForTask(cropId);
    uiClosePlantMenu();
    renderHome();
  }
}

function uiHarvest(plotIndex) {
  const reward = harvestPlot(plotIndex);
  if (reward > 0) {
    onHarvestForTask();
    renderHome();
  }
}
/* =====================================================
   SECTION F — VISUAL ENHANCEMENTS (CSS ONLY)
   (ADD BELOW SECTION E — DO NOT DUPLICATE)
===================================================== */

/* نحقن CSS إضافي بدون لمس renderHome */
(function injectFarmVisuals(){
  const style = document.createElement("style");
  style.innerHTML = `
    /* تحسين أرض المزرعة */
    .farm-board{
      background:
        radial-gradient(circle at 20% 20%, rgba(255,255,255,.05), transparent 40%),
        radial-gradient(circle at 80% 30%, rgba(0,0,0,.15), transparent 45%),
        linear-gradient(#6fbf55,#4e8f3a);
    }

    /* تحسين التربة */
    .plot{
      background:
        linear-gradient(180deg, #6a4a2f 0%, #4a321d 60%, #3a2716 100%);
    }

    .plot::after{
      content:"";
      position:absolute;
      inset:0;
      border-radius:14px;
      box-shadow:
        inset 0 2px 3px rgba(255,255,255,.08),
        inset 0 -3px 6px rgba(0,0,0,.4);
      pointer-events:none;
    }

    /* حركة نمو النبات */
    .plant{
      animation: plantGrow 2.5s ease-in-out infinite alternate;
    }

    @keyframes plantGrow{
      from{ transform:scale(.96); }
      to{ transform:scale(1.06); }
    }

    /* الأرض الجاهزة للحصاد */
    .plot:not(.locked) .plant:contains("🌾"){
      filter: drop-shadow(0 0 6px rgba(255,215,0,.6));
    }

    /* تحسين العداد */
    .timer{
      box-shadow:0 2px 6px rgba(0,0,0,.6);
    }

    /* تحسين نافذة اختيار المحصول */
    #plantMenu h3{
      margin-bottom:10px;
    }
    #plantMenu button{
      transition:transform .15s ease, box-shadow .15s ease;
    }
    #plantMenu button:hover{
      transform:scale(1.05);
      box-shadow:0 0 10px rgba(255,200,0,.4);
    }
  `;
  document.head.appendChild(style);
})();
