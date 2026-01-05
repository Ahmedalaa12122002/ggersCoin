/* =====================================================
   Home Page
   File: pages/home.page.js
===================================================== */

/* ---------- Crops ---------- */
const CROPS = [
  { id: "wheat",  name: "قمح",   icon: "🌾", time: 5  },
  { id: "corn",   name: "ذرة",   icon: "🌽", time: 10 },
  { id: "carrot", name: "جزر",   icon: "🥕", time: 15 },
  { id: "tomato", name: "طماطم", icon: "🍅", time: 20 },
  { id: "grape",  name: "عنب",   icon: "🍇", time: 25 }
];

/* ---------- Farm State ---------- */
const farmState = {
  plots: Array.from({ length: 12 }, () => ({
    planted: false,
    crop: null,
    startTime: 0,
    duration: 0,
    anim: ""
  })),
  selectingPlot: null
};

/* ---------- Time Helper ---------- */
function now() {
  return Math.floor(Date.now() / 1000);
}

/* =====================================================
   Page State
===================================================== */
let HOME_ACTIVE = false;

/* =====================================================
   Render Home (كما هو)
===================================================== */
function renderHome() {
  if (!HOME_ACTIVE) return;

  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = `
    <!-- نفس HTML و CSS بدون أي تغيير -->
    ${/* اختصار هنا للشرح فقط – في ملفك انسخ نفس HTML السابق */""}
  `;

  bindFarmEvents();
}

/* =====================================================
   Time Tick Handler (الجديد)
===================================================== */
function onTimeTick(currentTime) {
  if (!HOME_ACTIVE) return;

  // مجرد إعادة رسم لو في زرع شغال
  if (farmState.plots.some(p => p.planted && currentTime - p.startTime < p.duration)) {
    renderHome();
  }
}

/* =====================================================
   Lifecycle Hooks (المهم)
===================================================== */
function onHomeEnter() {
  HOME_ACTIVE = true;
  TimeEngine.subscribe(onTimeTick);
  renderHome();
}

function onHomeLeave() {
  HOME_ACTIVE = false;
  TimeEngine.unsubscribe(onTimeTick);
}

/* =====================================================
   Farm Events (كما هي)
===================================================== */
function bindFarmEvents(){
  document.querySelectorAll(".farm-plot").forEach(el=>{
    el.onclick = ()=>{
      if (!HOME_ACTIVE) return;

      const index = +el.dataset.index;
      const plot = farmState.plots[index];

      if (plot.planted && now() - plot.startTime >= plot.duration) {
        plot.anim = "harvest";
        setTimeout(()=>{
          plot.planted = false;
          plot.crop = null;
          plot.startTime = 0;
          plot.duration = 0;
          plot.anim = "";
          renderHome();
        },500);
        return;
      }

      if (!plot.planted) {
        farmState.selectingPlot = index;
        openCropSelector();
      }
    };
  });
}

/* =====================================================
   Crop Selector (كما هو)
===================================================== */
function openCropSelector(){
  if (!HOME_ACTIVE) return;

  const overlay = document.createElement("div");
  overlay.className = "crop-selector";

  overlay.innerHTML = `
    <div class="crop-box">
      <h3>اختر المحصول</h3>
      <div class="crop-list">
        ${CROPS.map(c=>`
          <button class="crop-btn" data-id="${c.id}">
            ${c.icon}<br>${c.name}<br><small>${c.time}s</small>
          </button>
        `).join("")}
      </div>
    </div>
  `;

  overlay.onclick = e=>{
    if(e.target === overlay) overlay.remove();
  };

  overlay.querySelectorAll(".crop-btn").forEach(btn=>{
    btn.onclick = ()=>{
      const crop = CROPS.find(c=>c.id===btn.dataset.id);
      const plot = farmState.plots[farmState.selectingPlot];

      plot.planted = true;
      plot.crop = crop;
      plot.startTime = now();
      plot.duration = crop.time;
      plot.anim = "grow";

      farmState.selectingPlot = null;
      overlay.remove();
      renderHome();
    };
  });

  document.body.appendChild(overlay);
   }
