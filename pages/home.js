/* =====================================================
   WinHive – Home Page (Farm Game)
   File: home.page.js
   NOTE:
   - هذا الملف لا ينفّذ أي شيء تلقائيًا
   - main.js هو المسؤول عن استدعاء renderHome()
===================================================== */

/* =========================
   CONSTANTS
========================= */
const TOTAL_PLOTS = 6;

const CROPS = [
  { id: "wheat", name: "قمح", time: 60, reward: 1, icon: "🌾" },
  { id: "carrot", name: "جزر", time: 120, reward: 2, icon: "🥕" },
  { id: "pepper", name: "فلفل", time: 180, reward: 3, icon: "🌶️" }
];

/* =========================
   STATE (LocalStorage)
========================= */
function getFarmState() {
  const saved = localStorage.getItem("winhive_farm_state");
  if (saved) return JSON.parse(saved);

  return {
    vip: 0, // 0 = غير VIP
    points: 0,
    plots: Array.from({ length: TOTAL_PLOTS }, () => ({
      cropId: null,
      plantedAt: 0,
      growTime: 0
    }))
  };
}

function saveFarmState(state) {
  localStorage.setItem("winhive_farm_state", JSON.stringify(state));
}

/* =========================
   HELPERS
========================= */
function now() {
  return Math.floor(Date.now() / 1000);
}

function isVipUnlocked(plotIndex, vipLevel) {
  // VIP 0 → أرض واحدة فقط
  return plotIndex === 0 || vipLevel > 0;
}

function getCrop(id) {
  return CROPS.find(c => c.id === id);
}

/* =========================
   GAME ACTIONS
========================= */
function plantCrop(plotIndex, cropId) {
  const state = getFarmState();
  const plot = state.plots[plotIndex];
  if (!plot || plot.cropId) return;

  const crop = getCrop(cropId);
  if (!crop) return;

  plot.cropId = cropId;
  plot.plantedAt = now();
  plot.growTime = crop.time;

  saveFarmState(state);
  renderHome();
}

function harvestCrop(plotIndex) {
  const state = getFarmState();
  const plot = state.plots[plotIndex];
  if (!plot || !plot.cropId) return;

  const elapsed = now() - plot.plantedAt;
  if (elapsed < plot.growTime) return;

  const crop = getCrop(plot.cropId);
  state.points += crop.reward;

  plot.cropId = null;
  plot.plantedAt = 0;
  plot.growTime = 0;

  saveFarmState(state);
  renderHome();
}

/* =========================
   UI HELPERS
========================= */
function openPlantMenu(plotIndex) {
  const overlay = document.createElement("div");
  overlay.id = "plant-menu";
  overlay.style = `
    position:fixed;inset:0;
    background:rgba(0,0,0,.8);
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:9999;
  `;

  let html = `
    <div style="background:#111;padding:16px;border-radius:16px;color:#fff;width:280px">
      <h3 style="text-align:center">اختر محصول</h3>
  `;

  CROPS.forEach(c => {
    html += `
      <button onclick="plantCrop(${plotIndex},'${c.id}')"
        style="width:100%;margin:6px 0;padding:10px;border-radius:12px;
        border:none;background:#222;color:#fff">
        ${c.icon} ${c.name} – ${c.time}ث
      </button>
    `;
  });

  html += `
      <button onclick="document.getElementById('plant-menu').remove()"
        style="margin-top:10px;background:none;border:none;color:#aaa;width:100%">
        إلغاء
      </button>
    </div>
  `;

  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

/* =========================
   RENDER HOME
========================= */
function renderHome() {
  const content = document.getElementById("content");
  if (!content) return;

  const state = getFarmState();

  let html = `
    <style>
      .farm{max-width:420px;margin:auto}
      .farm-grid{
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:12px;
        margin-top:20px;
      }
      .plot{
        height:90px;
        border-radius:14px;
        background:linear-gradient(#6b4b2a,#4a331c);
        display:flex;
        justify-content:center;
        align-items:center;
        color:#fff;
        font-size:22px;
        cursor:pointer;
        position:relative;
      }
      .plot.locked{
        background:#333;
        cursor:not-allowed;
      }
      .timer{
        position:absolute;
        top:6px;
        font-size:11px;
        background:rgba(0,0,0,.6);
        padding:2px 6px;
        border-radius:8px;
      }
    </style>

    <div class="farm">
      <div style="display:flex;justify-content:space-between">
        <div>💰 ${state.points}</div>
        <div>👑 VIP ${state.vip}</div>
      </div>

      <div class="farm-grid">
  `;

  state.plots.forEach((plot, i) => {
    if (!isVipUnlocked(i, state.vip)) {
      html += `<div class="plot locked">🔒</div>`;
      return;
    }

    if (!plot.cropId) {
      html += `
        <div class="plot" onclick="openPlantMenu(${i})">
          🌱
        </div>
      `;
      return;
    }

    const elapsed = now() - plot.plantedAt;
    const remaining = plot.growTime - elapsed;
    const crop = getCrop(plot.cropId);

    if (remaining > 0) {
      html += `
        <div class="plot">
          <div class="timer">${remaining}ث</div>
          ${crop.icon}
        </div>
      `;
    } else {
      html += `
        <div class="plot" onclick="harvestCrop(${i})">
          🌾
        </div>
      `;
    }
  });

  html += `
      </div>
    </div>
  `;

  content.innerHTML = html;

  // إعادة الرسم كل ثانية لو في زرع شغال
  if (state.plots.some(p => p.cropId)) {
    setTimeout(renderHome, 1000);
  }
     }
