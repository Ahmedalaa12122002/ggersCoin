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
    console.warn("Storage corrupted, resetting");
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

/* ---------- Crop Helper ---------- */
function getCropById(cropId) {
  return CROPS.find(c => c.id === cropId) || null;
}

/* ---------- Plant Crop ---------- */
/**
 * يزرع محصولًا في أرض محددة
 */
function plantCrop(plotIndex, cropId, growTimeSeconds) {
  const plot = state.plots[plotIndex];
  if (!plot) return false;
  if (plot.cropId !== null) return false; // الأرض غير فارغة

  plot.cropId = cropId;
  plot.plantedAt = nowSeconds();
  plot.growTime = growTimeSeconds;

  saveState();
  return true;
}

/* ---------- Growth Status ---------- */
/**
 * حالة نمو الأرض
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
 * يحصد الأرض الجاهزة
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

  // إعادة ضبط الأرض
  plot.cropId = null;
  plot.plantedAt = 0;
  plot.growTime = 0;

  saveState();
  return reward;
   }
/* =====================================================
   PART 3 — VIP SYSTEM (UNLOCK PLOTS + SPEED BONUS)
===================================================== */

/* ---------- VIP Config ---------- */
/**
 * يعيد إعدادات VIP حسب المستوى
 */
function getVipConfig(level) {
  return {
    level,
    unlockedPlots: Math.min(1 + level, TOTAL_PLOTS), // أرض واحدة + كل مستوى
    speedReduction: level * 0.05, // 5% تقليل وقت لكل VIP
    taskBonus: level * 0.10       // سيُستخدم لاحقًا
  };
}

/* ---------- Plot Access ---------- */
/**
 * هل الأرض مفتوحة حسب VIP؟
 */
function isPlotUnlocked(plotIndex) {
  const vip = getVipConfig(state.vipLevel);
  return plotIndex < vip.unlockedPlots;
}

/* ---------- Grow Time Calculator ---------- */
/**
 * يحسب وقت الزراعة بعد خصم VIP
 */
function calculateGrowTime(baseTimeSeconds) {
  const vip = getVipConfig(state.vipLevel);
  const reduced = baseTimeSeconds * (1 - vip.speedReduction);
  return Math.max(1, Math.round(reduced));
}

/* ---------- VIP Mutations ---------- */
/**
 * تعيين مستوى VIP (للاختبار الآن)
 */
function setVipLevel(level) {
  const newLevel = Math.max(0, Math.min(10, level)); // VIP من 0 إلى 10
  state.vipLevel = newLevel;
  saveState();
}

/**
 * ترقية VIP بمستوى واحد
 */
function upgradeVip() {
  if (state.vipLevel < 10) {
    state.vipLevel += 1;
    saveState();
  }
}
/* =====================================================
   PART 4 — TASK SYSTEM (FARM TASKS + VIP BONUS)
===================================================== */

/* ---------- Task Pool ---------- */
const TASK_POOL = [
  { id: "harvest_any_5", type: "harvest_any", target: 5, baseReward: 5 },
  { id: "harvest_any_10", type: "harvest_any", target: 10, baseReward: 8 },
  { id: "plant_wheat_3", type: "plant_crop", cropId: "wheat", target: 3, baseReward: 4 },
  { id: "plant_carrot_2", type: "plant_crop", cropId: "carrot", target: 2, baseReward: 6 }
];

/* ---------- Task Generator ---------- */
/**
 * يولّد مهمة جديدة عشوائية
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

/* ---------- Task Text ---------- */
/**
 * نص المهمة (للاستخدام في الواجهة لاحقًا)
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

/* ---------- Task Progress Hooks ---------- */
/**
 * يُستدعى بعد أي عملية زرع
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
 * يُستدعى بعد أي عملية حصاد
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

    // توليد مهمة جديدة مباشرة
    generateNewTask();
  }

  saveState();
   }
/* =====================================================
   PART 5 — RENDER + UI (FARM INTERFACE)
===================================================== */

/* ---------- Render Home ---------- */
function renderHome() {
  const content = document.getElementById("content");
  if (!content) return;

  // تأكد من وجود مهمة
  if (!state.task) {
    generateNewTask();
  }

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
      width:96px;
      height:86px;
      border-radius:14px;
      background:linear-gradient(#5a3b1e,#3e2a15);
      display:flex;
      justify-content:center;
      align-items:center;
      color:#fff;
      font-size:24px;
      cursor:pointer;
    }
    .plot.locked{
      background:#333;
      opacity:.7;
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
      font-size:26px;
      z-index:2;
    }
    .timer{
      position:absolute;
      top:-18px;
      background:rgba(0,0,0,.75);
      padding:2px 6px;
      border-radius:8px;
      font-size:11px;
    }

    /* توزيع الأراضي */
    .p0{ top:40px; left:40px; }
    .p1{ top:40px; right:40px; }
    .p2{ top:160px; left:160px; }
    .p3{ bottom:160px; left:40px; }
    .p4{ bottom:160px; right:40px; }
    .p5{ bottom:40px; left:160px; }
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

  // إعادة الرسم أثناء النمو
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
   PART 6 — VISUAL ENHANCEMENTS + SAFE BOOTSTRAP
   (FINAL PART — DO NOT DUPLICATE ANYTHING)
===================================================== */

/* ---------- Visual Enhancements (Safe CSS) ---------- */
(function injectSafeVisuals(){
  const style = document.createElement("style");
  style.innerHTML = `
    /* إحساس أرض أكثر واقعية */
    .farm-board{
      background:
        radial-gradient(circle at 20% 20%, rgba(255,255,255,.06), transparent 40%),
        radial-gradient(circle at 80% 30%, rgba(0,0,0,.18), transparent 45%),
        linear-gradient(#6fbf55,#4e8f3a);
    }

    /* تحسين شكل الأرض */
    .plot{
      box-shadow:
        inset 0 2px 3px rgba(255,255,255,.08),
        inset 0 -3px 6px rgba(0,0,0,.45),
        0 4px 10px rgba(0,0,0,.35);
      transition:transform .15s ease;
    }

    .plot:not(.locked):active{
      transform:scale(.95);
    }

    /* حركة النبات */
    .plant{
      animation: plantPulse 2.5s ease-in-out infinite alternate;
    }

    @keyframes plantPulse{
      from{ transform:scale(.96); }
      to{ transform:scale(1.05); }
    }

    /* تحسين العداد */
    .timer{
      box-shadow:0 2px 6px rgba(0,0,0,.6);
    }
  `;
  document.head.appendChild(style);
})();

/* ---------- Safe Bootstrap (Guaranteed Start) ---------- */
(function safeStart(){
  function start(){
    try {
      if (!document.getElementById("content")) {
        console.error("❌ عنصر #content غير موجود");
        return;
      }

      // تهيئة اللعبة
      initGame();

      // تأكيد وجود مهمة
      if (!state.task) {
        generateNewTask();
      }

      // أول رسم
      renderHome();

      console.log("✅ WinHive Farm started successfully");
    } catch (e) {
      console.error("❌ Game failed to start", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
