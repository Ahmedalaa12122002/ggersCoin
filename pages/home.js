/* =========================================
   WinHive – Home (Farm System v3)
   Farm + VIP + Visual + Smart Tasks
========================================= */

const CROPS = [
  { id: "wheat",  name: "قمح",  time: 5,  reward: 1 },
  { id: "carrot", name: "جزر",  time: 10, reward: 2 },
  { id: "pepper", name: "فلفل", time: 15, reward: 2 },
  { id: "grape",  name: "عنب",  time: 20, reward: 3 },
  { id: "rocket", name: "جرجير",time: 30, reward: 3 }
];

const TOTAL_PLOTS = 6;

let state = {
  points: 0,
  vip: 0,
  plots: [],
  task: null
};

/* ---------- تحميل ---------- */
function loadHome() {
  const saved = localStorage.getItem("winhive_farm");
  if (saved) {
    state = JSON.parse(saved);
  } else {
    initPlots();
    generateTask();
    saveState();
  }
  renderHome();
}

/* ---------- تهيئة ---------- */
function initPlots() {
  state.plots = [];
  for (let i = 0; i < TOTAL_PLOTS; i++) {
    state.plots.push({ crop: null, plantedAt: 0, growTime: 0 });
  }
}

/* ---------- حفظ ---------- */
function saveState() {
  localStorage.setItem("winhive_farm", JSON.stringify(state));
}

/* ---------- المهام ---------- */
function generateTask() {
  const tasks = [
    { type: "harvest_any", target: 3, reward: 3, progress: 0 },
    { type: "plant_wheat", target: 2, reward: 2, progress: 0 },
    { type: "harvest_any", target: 5, reward: 5, progress: 0 }
  ];
  state.task = tasks[Math.floor(Math.random() * tasks.length)];
}

function taskText() {
  const t = state.task;
  if (!t) return "";
  if (t.type === "harvest_any")
    return `🌾 احصد ${t.target} مرات (${t.progress}/${t.target})`;
  if (t.type === "plant_wheat")
    return `🌱 ازرع قمح ${t.target} مرات (${t.progress}/${t.target})`;
}

function updateTask(type, cropId = null) {
  const t = state.task;
  if (!t) return;

  if (t.type === "harvest_any" && type === "harvest") {
    t.progress++;
  }

  if (t.type === "plant_wheat" && type === "plant" && cropId === "wheat") {
    t.progress++;
  }

  if (t.progress >= t.target) {
    state.points += t.reward;
    alert(`🎉 أنجزت المهمة +${t.reward} نقاط`);
    generateTask();
  }
}

/* ---------- رسم ---------- */
function renderHome() {
  saveState();
  const content = document.getElementById("content");
  const now = Date.now();

  let html = `
  <style>
    .farm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    .plot{height:120px;border-radius:16px;
      background:linear-gradient(#4a3724,#3b2f1e);
      box-shadow:inset 0 4px 6px rgba(0,0,0,.4);
      display:flex;flex-direction:column;
      justify-content:center;align-items:center;
      color:#fff;font-size:13px;position:relative}
    .soil{position:absolute;bottom:0;width:100%;height:40%;
      background:linear-gradient(#3b2f1e,#2a1f14)}
    .plant{font-size:32px;animation:grow 2s ease-in-out infinite alternate}
    @keyframes grow{from{transform:scale(.95)}to{transform:scale(1.05)}}
    .locked{opacity:.6}
    .harvest-ready{box-shadow:0 0 12px rgba(106,211,106,.8)}
    .task-box{
      background:#111;padding:10px;border-radius:12px;
      margin-bottom:10px;text-align:center;font-size:13px
    }
  </style>

  <div style="max-width:420px;margin:auto;padding:12px">
    <div style="display:flex;justify-content:space-between;margin-bottom:6px">
      <div>💰 ${state.points}</div>
      <div>👑 VIP ${state.vip}</div>
    </div>

    <div class="task-box">
      <strong>📌 المهمة الحالية</strong><br>
      ${taskText()}
    </div>

    <h3 style="text-align:center;margin-bottom:10px">🌾 المزرعة</h3>
    <div class="farm-grid">
  `;

  state.plots.forEach((plot, index) => {
    const unlocked = index < state.vip + 1;

    if (!unlocked) {
      html += `<div class="plot locked"><div>🔒</div><small>VIP</small></div>`;
      return;
    }

    if (!plot.crop) {
      html += `
      <div class="plot" onclick="openPlantMenu(${index})">
        <div class="soil"></div>
        <div>🟫</div><small>ازرع</small>
      </div>`;
      return;
    }

    const elapsed = (now - plot.plantedAt) / 1000;
    if (elapsed < plot.growTime) {
      html += `
      <div class="plot">
        <div class="soil"></div>
        <div class="plant">🌱</div>
        <small>⏳ ${Math.ceil(plot.growTime - elapsed)}s</small>
      </div>`;
    } else {
      html += `
      <div class="plot harvest-ready" onclick="harvest(${index})">
        <div class="soil"></div>
        <div class="plant">🌾</div>
        <small>احصد</small>
      </div>`;
    }
  });

  html += `</div></div>`;
  content.innerHTML = html;

  if (state.plots.some(p => p.crop && (Date.now() - p.plantedAt) / 1000 < p.growTime)) {
    setTimeout(renderHome, 1000);
  }
}

/* ---------- الزراعة ---------- */
function openPlantMenu(index) {
  let menu = `
  <div id="plantMenu" style="position:fixed;inset:0;
    background:rgba(0,0,0,.85);z-index:9999;
    display:flex;justify-content:center;align-items:center">
    <div style="background:#111;padding:14px;border-radius:14px;color:#fff;text-align:center">
      <h3>اختر محصولًا</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">
  `;

  CROPS.forEach(c => {
    menu += `
      <button onclick="plant(${index},'${c.id}')"
        style="padding:8px 12px;border:none;border-radius:10px;
        background:#222;color:#fff;font-size:12px">
        ${c.name}<br><small>${c.time}د</small>
      </button>`;
  });

  menu += `
      </div>
      <button onclick="closePlantMenu()" style="margin-top:10px;background:none;border:none;color:#aaa">
        إلغاء
      </button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML("beforeend", menu);
}

function closePlantMenu() {
  document.getElementById("plantMenu")?.remove();
}

function plant(index, cropId) {
  const crop = CROPS.find(c => c.id === cropId);
  state.plots[index] = { crop: crop.id, plantedAt: Date.now(), growTime: crop.time };
  updateTask("plant", cropId);
  closePlantMenu();
  renderHome();
}

/* ---------- الحصاد ---------- */
function harvest(index) {
  const plot = state.plots[index];
  const crop = CROPS.find(c => c.id === plot.crop);
  state.points += crop.reward;
  state.plots[index] = { crop: null, plantedAt: 0, growTime: 0 };
  updateTask("harvest");
  renderHome();
       }
