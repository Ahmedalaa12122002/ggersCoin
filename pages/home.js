/* =========================================
   WinHive – Home (Farm System v1)
   6 Plots + VIP + Realistic Farming
========================================= */

/* ---------- الإعدادات ---------- */
const CROPS = [
  { id: "wheat",  name: "قمح",  time: 5,  reward: 1, iconGrow: "🌱", iconReady: "🌾" },
  { id: "carrot", name: "جزر",  time: 10, reward: 2, iconGrow: "🥕", iconReady: "🥕" },
  { id: "pepper", name: "فلفل", time: 15, reward: 2, iconGrow: "🌶️", iconReady: "🌶️" },
  { id: "grape",  name: "عنب",  time: 20, reward: 3, iconGrow: "🍇", iconReady: "🍇" },
  { id: "rocket", name: "جرجير",time: 30, reward: 3, iconGrow: "🥬", iconReady: "🥬" }
];

const TOTAL_PLOTS = 6;

/* ---------- الحالة ---------- */
let state = {
  points: 0,
  vip: 0, // من 0 إلى 5
  plots: [] // سيتم تهيئتها
};

/* ---------- تحميل الصفحة ---------- */
function loadHome() {
  const saved = localStorage.getItem("winhive_farm");
  if (saved) {
    state = JSON.parse(saved);
  } else {
    initPlots();
    saveState();
  }
  renderHome();
}

/* ---------- تهيئة الأراضي ---------- */
function initPlots() {
  state.plots = [];
  for (let i = 0; i < TOTAL_PLOTS; i++) {
    state.plots.push({
      crop: null,
      plantedAt: 0,
      growTime: 0
    });
  }
}

/* ---------- حفظ ---------- */
function saveState() {
  localStorage.setItem("winhive_farm", JSON.stringify(state));
}

/* ---------- رسم الواجهة ---------- */
function renderHome() {
  saveState();
  const content = document.getElementById("content");
  const now = Date.now();

  let html = `
  <div style="max-width:420px;margin:auto;padding:12px">

    <div style="display:flex;justify-content:space-between;margin-bottom:10px">
      <div>💰 النقاط: ${state.points}</div>
      <div>👑 VIP: ${state.vip}</div>
    </div>

    <h2 style="text-align:center;margin-bottom:12px">🌾 WinHive Farm</h2>

    <div style="
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:10px;
    ">
  `;

  state.plots.forEach((plot, index) => {
    const unlocked = index < state.vip + 1;

    if (!unlocked) {
      html += lockedPlot();
    } else if (!plot.crop) {
      html += emptyPlot(index);
    } else {
      const elapsed = (now - plot.plantedAt) / 1000;
      if (elapsed < plot.growTime) {
        const left = Math.ceil(plot.growTime - elapsed);
        html += growingPlot(plot, left);
      } else {
        html += readyPlot(plot, index);
      }
    }
  });

  html += `
    </div>
  </div>
  `;

  content.innerHTML = html;

  // تحديث تلقائي أثناء النمو
  if (state.plots.some(p => p.crop && (Date.now() - p.plantedAt) / 1000 < p.growTime)) {
    setTimeout(renderHome, 1000);
  }
}

/* ---------- أشكال الأراضي ---------- */
function basePlotBox(inner) {
  return `
  <div style="
    background:#3b2f1e;
    border-radius:14px;
    padding:10px;
    height:110px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    color:#fff;
    text-align:center;
    font-size:13px;
  ">
    ${inner}
  </div>
  `;
}

function lockedPlot() {
  return basePlotBox(`
    <div style="font-size:28px">🔒</div>
    <div style="opacity:.8">افتحها مع VIP</div>
  `);
}

function emptyPlot(index) {
  return basePlotBox(`
    <div style="font-size:28px">🟫</div>
    <button onclick="openPlantMenu(${index})"
      style="
        margin-top:6px;
        padding:6px 10px;
        border:none;
        border-radius:10px;
        background:#f5c400;
        color:#000;
        font-size:12px;
      ">
      ازرع
    </button>
  `);
}

function growingPlot(plot, left) {
  const crop = CROPS.find(c => c.id === plot.crop);
  const progress = Math.min(100, ((plot.growTime - left) / plot.growTime) * 100);

  return basePlotBox(`
    <div style="font-size:28px">${crop.iconGrow}</div>
    <div>${crop.name}</div>
    <div style="font-size:11px">⏳ ${left}s</div>
    <div style="width:100%;height:6px;background:#222;border-radius:4px;overflow:hidden;margin-top:4px">
      <div style="height:100%;width:${progress}%;background:#f5c400"></div>
    </div>
  `);
}

function readyPlot(plot, index) {
  const crop = CROPS.find(c => c.id === plot.crop);

  return basePlotBox(`
    <div style="font-size:28px">${crop.iconReady}</div>
    <div>${crop.name}</div>
    <button onclick="harvest(${index})"
      style="
        margin-top:6px;
        padding:6px 10px;
        border:none;
        border-radius:10px;
        background:#6ad36a;
        color:#000;
        font-size:12px;
      ">
      احصد
    </button>
  `);
}

/* ---------- الزراعة ---------- */
function openPlantMenu(index) {
  let menu = `
  <div id="plantMenu" style="
    position:fixed;inset:0;
    background:rgba(0,0,0,.85);
    z-index:9999;
    display:flex;
    justify-content:center;
    align-items:center;
  ">
    <div style="
      background:#111;
      padding:14px;
      border-radius:14px;
      max-width:300px;
      width:100%;
      text-align:center;
      color:#fff;
    ">
      <h3>اختر محصولًا</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:10px">
  `;

  CROPS.forEach(c => {
    menu += `
      <button onclick="plant(${index},'${c.id}')"
        style="
          padding:8px 12px;
          border:none;
          border-radius:10px;
          background:#222;
          color:#fff;
          font-size:12px;
        ">
        ${c.name}<br><small>${c.time}د</small>
      </button>
    `;
  });

  menu += `
      </div>
      <button onclick="closePlantMenu()"
        style="margin-top:10px;background:none;border:none;color:#aaa">
        إلغاء
      </button>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML("beforeend", menu);
}

function closePlantMenu() {
  document.getElementById("plantMenu")?.remove();
}

function plant(index, cropId) {
  const crop = CROPS.find(c => c.id === cropId);
  state.plots[index] = {
    crop: crop.id,
    plantedAt: Date.now(),
    growTime: crop.time
  };
  closePlantMenu();
  renderHome();
}

/* ---------- الحصاد ---------- */
function harvest(index) {
  const plot = state.plots[index];
  const crop = CROPS.find(c => c.id === plot.crop);
  state.points += crop.reward;
  state.plots[index] = { crop: null, plantedAt: 0, growTime: 0 };
  renderHome();
                               }
