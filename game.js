/* =============================
   حالة اللاعب (مؤقتة بدون DB)
============================= */
let player = {
  points: 0,
  vip: 0,
};

/* =============================
   المحاصيل
============================= */
const crops = {
  wheat: { name: "قمح 🌾", time: 300, reward: 5 },
  carrot: { name: "جزر 🥕", time: 600, reward: 10 },
  pepper: { name: "فلفل 🌶️", time: 900, reward: 15 },
  grape: { name: "عنب 🍇", time: 1200, reward: 20 },
  rocket: { name: "جرجير 🥬", time: 1800, reward: 30 },
};

/* =============================
   الأراضي
============================= */
let lands = [
  { crop: null, end: 0 }, // مفتوحة
  { crop: null, end: 0 },
  { crop: null, end: 0 },
  { crop: null, end: 0 },
  { crop: null, end: 0 },
  { crop: null, end: 0 },
];

/* =============================
   فتح اختيار المحصول
============================= */
let currentLand = null;

function openPlant(index) {
  currentLand = index;
  document.getElementById("overlay").classList.remove("hidden");
}

/* =============================
   زرع المحصول
============================= */
function plant(type) {
  const crop = crops[type];
  lands[currentLand].crop = type;
  lands[currentLand].end = Date.now() + crop.time * 1000;
  closeOverlay();
  renderFarm();
}

/* =============================
   الحصاد
============================= */
function harvest(index) {
  const land = lands[index];
  if (!land.crop) return;

  if (Date.now() >= land.end) {
    player.points += crops[land.crop].reward;
    land.crop = null;
    land.end = 0;
    updateHeader();
    renderFarm();
  }
}

/* =============================
   تحديث المزرعة
============================= */
function renderFarm() {
  const grid = document.getElementById("landGrid");
  grid.innerHTML = "";

  lands.forEach((land, i) => {
    const div = document.createElement("div");
    div.className = "land";

    if (i > player.vip) {
      div.classList.add("locked");
      div.innerText = "🔒 VIP";
      grid.appendChild(div);
      return;
    }

    if (!land.crop) {
      div.innerText = "🌱";
      div.onclick = () => openPlant(i);

      const btn = document.createElement("div");
      btn.className = "plant-btn";
      btn.innerText = "ازرع";
      div.appendChild(btn);
    } else {
      const remaining = Math.max(
        0,
        Math.floor((land.end - Date.now()) / 1000)
      );

      if (remaining === 0) {
        div.innerText = "🌾";
        div.onclick = () => harvest(i);
      } else {
        div.innerText = "⏳";
        const t = document.createElement("div");
        t.className = "plant-btn";
        t.innerText = remaining + "ث";
        div.appendChild(t);
      }
    }

    grid.appendChild(div);
  });
}

/* =============================
   الهيدر
============================= */
function updateHeader() {
  document.getElementById("points").innerText = player.points;
  document.getElementById("vip").innerText = player.vip;
}

/* =============================
   نافذة المحاصيل
============================= */
function closeOverlay() {
  document.getElementById("overlay").classList.add("hidden");
}

/* =============================
   تشغيل مبدئي
============================= */
updateHeader();
renderFarm();
setInterval(renderFarm, 1000);
