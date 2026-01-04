/* ================================
   HOME PAGE – FARM GAME
================================ */

const STORAGE_KEY = "winhive_farm_v1";

const CROPS = [
  { id: "wheat", name: "قمح", time: 30, icon: "🌾" },
  { id: "corn", name: "ذرة", time: 60, icon: "🌽" },
  { id: "carrot", name: "جزر", time: 90, icon: "🥕" }
];

let farm = {
  vip: false,
  plots: []
};

/* ---------- INIT ---------- */
function loadFarm() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    farm = JSON.parse(saved);
  } else {
    farm.plots = Array.from({ length: 6 }, (_, i) => ({
      locked: i !== 0,
      crop: null,
      plantedAt: 0
    }));
    saveFarm();
  }
}

function saveFarm() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(farm));
}

/* ---------- RENDER ---------- */
function renderHome() {
  loadFarm();

  let html = `
    <h3 style="text-align:center">🌱 المزرعة</h3>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
  `;

  farm.plots.forEach((plot, i) => {
    if (plot.locked) {
      html += `<div style="padding:20px;background:#222;text-align:center;border-radius:10px">🔒 VIP</div>`;
      return;
    }

    if (!plot.crop) {
      html += `
        <div onclick="openPlant(${i})"
          style="padding:20px;background:#3e2723;text-align:center;border-radius:10px;cursor:pointer">
          أرض فارغة
        </div>`;
      return;
    }

    const crop = CROPS.find(c => c.id === plot.crop);
    const elapsed = Math.floor(Date.now()/1000 - plot.plantedAt);
    const remaining = crop.time - elapsed;

    if (remaining <= 0) {
      html += `
        <div onclick="harvest(${i})"
          style="padding:20px;background:#4caf50;text-align:center;border-radius:10px;cursor:pointer">
          ${crop.icon}<br>احصد
        </div>`;
    } else {
      html += `
        <div style="padding:20px;background:#795548;text-align:center;border-radius:10px">
          ${crop.icon}<br>${remaining}s
        </div>`;
    }
  });

  html += "</div>";
  document.getElementById("content").innerHTML = html;

  setTimeout(renderHome, 1000);
}

/* ---------- ACTIONS ---------- */
function openPlant(index) {
  let menu = `<div style="position:fixed;inset:0;background:#000c;display:flex;align-items:center;justify-content:center">
    <div style="background:#111;padding:15px;border-radius:12px">`;

  CROPS.forEach(c => {
    menu += `<button onclick="plant(${index},'${c.id}')"
      style="display:block;width:100%;margin:6px 0">${c.icon} ${c.name}</button>`;
  });

  menu += `<button onclick="closeMenu()">إلغاء</button></div></div>`;
  document.body.insertAdjacentHTML("beforeend", menu);
}

function closeMenu() {
  document.body.lastChild.remove();
}

function plant(index, cropId) {
  farm.plots[index].crop = cropId;
  farm.plots[index].plantedAt = Math.floor(Date.now()/1000);
  saveFarm();
  closeMenu();
}

function harvest(index) {
  farm.plots[index].crop = null;
  farm.plots[index].plantedAt = 0;
  saveFarm();
}
