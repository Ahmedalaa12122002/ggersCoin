/* =====================================================
   HOME PAGE — FINAL STABLE VERSION
   WinHive Farm (NO NAV CONFLICT)
===================================================== */

/* =====================================================
   PART 1 — PAGE CONTRACT + GLOBAL STATE
===================================================== */

const PAGE_NAME = "home";

function isHomeActive() {
  return window.ACTIVE_PAGE === PAGE_NAME;
}

const HomeState = {
  points: 0,
  vipLevel: 0,
  plots: [],
  timer: null
};

/* =====================================================
   PART 2 — CONFIGURATION
===================================================== */

const TOTAL_PLOTS = 6;

const CROPS = [
  { id: "wheat",  name: "قمح",   growTime: 5,  reward: 1 },
  { id: "carrot", name: "جزر",   growTime: 10, reward: 2 },
  { id: "pepper", name: "فلفل",  growTime: 15, reward: 2 },
  { id: "grape",  name: "عنب",   growTime: 20, reward: 3 },
  { id: "rocket", name: "جرجير", growTime: 30, reward: 3 }
];

function getCrop(id) {
  return CROPS.find(c => c.id === id);
}

/* =====================================================
   PART 3 — STORAGE + INIT
===================================================== */

const STORAGE_KEY = "winhive_home_state_final";

function initHomeState() {
  HomeState.plots = [];
  for (let i = 0; i < TOTAL_PLOTS; i++) {
    HomeState.plots.push({
      cropId: null,
      plantedAt: 0,
      growTime: 0
    });
  }
}

function saveHomeState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(HomeState));
}

function loadHomeState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    Object.assign(HomeState, parsed);
    return true;
  } catch {
    return false;
  }
}

/* =====================================================
   PART 4 — REAL TIME GROWTH LOGIC
===================================================== */

function now() {
  return Math.floor(Date.now() / 1000);
}

function plantCrop(plotIndex, cropId) {
  const plot = HomeState.plots[plotIndex];
  if (!plot || plot.cropId) return;

  const crop = getCrop(cropId);
  plot.cropId = cropId;
  plot.plantedAt = now();
  plot.growTime = crop.growTime;

  saveHomeState();
}

function remainingTime(plot) {
  const end = plot.plantedAt + plot.growTime;
  return Math.max(0, end - now());
}

function growthProgress(plot) {
  if (!plot.cropId) return 0;
  const elapsed = now() - plot.plantedAt;
  return Math.min(1, elapsed / plot.growTime);
}

function harvest(plotIndex) {
  const plot = HomeState.plots[plotIndex];
  if (!plot || !plot.cropId) return;
  if (remainingTime(plot) > 0) return;

  const crop = getCrop(plot.cropId);
  HomeState.points += crop.reward;

  plot.cropId = null;
  plot.plantedAt = 0;
  plot.growTime = 0;

  saveHomeState();
}

/* =====================================================
   PART 5 — RENDER UI (HARD GUARD)
===================================================== */

function renderHome() {
  if (!isHomeActive()) return; // ⛔️ القفل النهائي

  const content = document.getElementById("content");
  if (!content) return;

  let html = `
  <style>
    .farm{max-width:420px;margin:0 auto;padding:12px}
    .plots{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
    .plot{
      position:relative;height:120px;border-radius:16px;
      background:linear-gradient(#6fbf55,#4e8f3a);
      overflow:hidden;cursor:pointer;
    }
    .soil{
      position:absolute;bottom:0;width:100%;height:45%;
      background:linear-gradient(#5a3b1e,#3e2a15)
    }
    .plant{
      position:absolute;left:50%;top:40%;
      transform:translate(-50%,-50%);
      font-size:28px;
    }
    .progress{
      position:absolute;top:0;left:0;height:6px;
      background:#ffd54f
    }
    .timer{
      position:absolute;bottom:6px;right:6px;
      background:rgba(0,0,0,.6);
      color:#fff;font-size:11px;
      padding:2px 6px;border-radius:6px
    }
  </style>

  <div class="farm">
    <h3>🌾 المزرعة</h3>
    <div>💰 ${HomeState.points}</div>
    <div class="plots">
  `;

  HomeState.plots.forEach((plot, i) => {
    if (!plot.cropId) {
      html += `
        <div class="plot" onclick="openPlantMenu(${i})">
          <div class="soil"></div>
        </div>`;
      return;
    }

    const rem = remainingTime(plot);
    const prog = growthProgress(plot);
    let icon = "🌱";
    if (prog > 0.66) icon = "🌾";
    else if (prog > 0.33) icon = "🌿";

    if (rem > 0) {
      html += `
        <div class="plot">
          <div class="progress" style="width:${prog*100}%"></div>
          <div class="soil"></div>
          <div class="plant">${icon}</div>
          <div class="timer">${rem}s</div>
        </div>`;
    } else {
      html += `
        <div class="plot" onclick="harvest(${i});renderHome()">
          <div class="soil"></div>
          <div class="plant">🌾</div>
        </div>`;
    }
  });

  html += `</div></div>`;
  content.innerHTML = html;
}

/* =====================================================
   PART 6 — VISUAL TIMER (SAFE)
===================================================== */

function startHomeTimer() {
  stopHomeTimer();
  HomeState.timer = setInterval(() => {
    if (!isHomeActive()) return; // ⛔️ حماية ثانية
    renderHome();
  }, 1000);
}

function stopHomeTimer() {
  if (HomeState.timer) {
    clearInterval(HomeState.timer);
    HomeState.timer = null;
  }
}

/* =====================================================
   PART 7 — PLANT MENU
===================================================== */

function openPlantMenu(plotIndex) {
  let html = `<div id="plantMenu" style="
    position:fixed;inset:0;background:#000c;
    display:flex;justify-content:center;align-items:center;z-index:9999">
    <div style="background:#111;padding:14px;border-radius:12px">`;

  CROPS.forEach(c => {
    html += `
      <button onclick="choosePlant(${plotIndex},'${c.id}')">
        ${c.name} (${c.growTime}s)
      </button><br>`;
  });

  html += `<button onclick="closePlantMenu()">إلغاء</button></div></div>`;
  document.body.insertAdjacentHTML("beforeend", html);
}

function closePlantMenu() {
  document.getElementById("plantMenu")?.remove();
}

function choosePlant(plotIndex, cropId) {
  plantCrop(plotIndex, cropId);
  closePlantMenu();
  renderHome();
}

/* =====================================================
   PART 8 — PAGE LIFECYCLE (CRITICAL)
===================================================== */

function onEnterHome() {
  if (!loadHomeState()) initHomeState();
  renderHome();
  startHomeTimer();
}

function onExitHome() {
  stopHomeTimer();
     }
