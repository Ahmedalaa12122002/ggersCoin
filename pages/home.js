/* =====================================================
   PART 1 — PAGE CONTRACT + GLOBAL STATE
===================================================== */

// تعريف اسم الصفحة (مهم للـ Page Manager)
const PAGE_NAME = "home";

// التحقق هل الصفحة نشطة
function isHomeActive() {
  return window.ACTIVE_PAGE === PAGE_NAME;
}

// حالة اللعبة
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
  { id: "wheat",  name: "قمح",   growTime: 5,  reward: 1, icon: "🌱" },
  { id: "carrot", name: "جزر",   growTime: 10, reward: 2, icon: "🥕" },
  { id: "pepper", name: "فلفل",  growTime: 15, reward: 2, icon: "🌶️" },
  { id: "grape",  name: "عنب",   growTime: 20, reward: 3, icon: "🍇" },
  { id: "rocket", name: "جرجير", growTime: 30, reward: 3, icon: "🥬" }
];

function getCrop(id) {
  return CROPS.find(c => c.id === id);
   }
/* =====================================================
   PART 3 — INIT + STORAGE
===================================================== */

const STORAGE_KEY = "winhive_home_state_v1";

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
   PART 4 — REAL TIME GROWTH
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
   PART 5 — UI RENDER
===================================================== */

function renderHome() {
  if (!isHomeActive()) return;

  const content = document.getElementById("content");
  if (!content) return;

  let html = `
  <div style="padding:12px">
    <h3>🌾 WinHive Farm</h3>
    <div>💰 ${HomeState.points}</div>

    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:10px">
  `;

  HomeState.plots.forEach((plot, i) => {
    if (!plot.cropId) {
      html += `
        <div onclick="openPlantMenu(${i})"
             style="background:#2f5b2f;padding:20px;border-radius:12px">
          🟫 أرض فارغة
        </div>`;
      return;
    }

    const rem = remainingTime(plot);
    if (rem > 0) {
      html += `
        <div style="background:#654321;padding:20px;border-radius:12px">
          ${getCrop(plot.cropId).icon}
          <div>⏱️ ${rem}s</div>
        </div>`;
    } else {
      html += `
        <div onclick="harvest(${i})"
             style="background:#4caf50;padding:20px;border-radius:12px">
          🌾 احصد
        </div>`;
    }
  });

  html += `</div></div>`;
  content.innerHTML = html;
   }
/* =====================================================
   PART 6 — VISUAL TIMER (NO BACKGROUND)
===================================================== */

function startHomeTimer() {
  stopHomeTimer();
  HomeState.timer = setInterval(() => {
    if (!isHomeActive()) return;
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
   PART 7 — UI ACTIONS
===================================================== */

function openPlantMenu(plotIndex) {
  let html = `<div id="plantMenu" style="
    position:fixed;inset:0;background:#000c;
    display:flex;justify-content:center;align-items:center">
    <div style="background:#111;padding:14px;border-radius:12px">`;

  CROPS.forEach(c => {
    html += `
      <button onclick="choosePlant(${plotIndex},'${c.id}')">
        ${c.icon} ${c.name} (${c.growTime}s)
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
   PART 8 — PAGE LIFECYCLE (NO CONFLICT GUARANTEE)
===================================================== */

function onEnterHome() {
  if (!loadHomeState()) initHomeState();
  renderHome();
  startHomeTimer();
}

function onExitHome() {
  stopHomeTimer();
}
