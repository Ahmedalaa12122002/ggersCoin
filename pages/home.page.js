/* =====================================================
   Home Page
   File: pages/home.page.js
   Responsibility:
   - Home screen
   - Farm game with real timers
   - Crop selection
   - Enhanced animations (plant & harvest)
   - Realistic farm visuals
   - Stable & extendable
===================================================== */

/* =====================================================
   PAGE GUARD (حل مشكلة ظهور اللعبة خارج الرئيسية)
===================================================== */
function isHomePage() {
  return document.body.dataset.page === "home";
}

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
   Render Home
===================================================== */
function renderHome() {
  if (!isHomePage()) return;

  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = `
    <style>
      .home-wrapper{padding:16px;max-width:480px;margin:0 auto;}
      .home-header{text-align:center;margin-bottom:10px;}
      .home-header h2{margin:0;font-size:22px;color:#ffd54f;}
      .home-header p{font-size:13px;color:#bbb;}

      .game-box{
        background:linear-gradient(#7cb342,#558b2f);
        border-radius:20px;
        padding:14px;
        box-shadow:inset 0 0 40px rgba(0,0,0,.35),0 8px 26px rgba(0,0,0,.55);
      }

      .farm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}

      .farm-plot{
        position:relative;height:92px;border-radius:18px;
        background:radial-gradient(circle at top,#8d6e63,#4e342e);
        display:flex;align-items:center;justify-content:center;
        cursor:pointer;overflow:hidden;
        box-shadow:
          inset 0 4px 6px rgba(255,255,255,.08),
          inset 0 -6px 10px rgba(0,0,0,.6),
          0 6px 12px rgba(0,0,0,.45);
      }

      .soil{
        position:absolute;bottom:0;width:100%;height:38%;
        background:linear-gradient(#5d4037,#3e2723);
      }

      .plant{z-index:2;font-size:30px;}
      .plant.grow{animation:growAnim 1.6s ease-out;}
      .plant.idle{animation:plantIdle 2.8s ease-in-out infinite alternate;}
      .plant.harvest{animation:harvestAnim .6s ease forwards;}

      @keyframes growAnim{
        0%{transform:scale(.3) translateY(20px);opacity:0}
        100%{transform:scale(1) translateY(0);opacity:1}
      }
      @keyframes plantIdle{
        from{transform:scale(.96)}
        to{transform:scale(1.05)}
      }
      @keyframes harvestAnim{
        to{transform:scale(0);opacity:0}
      }

      .timer{
        position:absolute;top:6px;
        background:rgba(0,0,0,.65);
        padding:2px 6px;border-radius:8px;
        font-size:11px;
      }

      .progress-bar{
        position:absolute;bottom:0;left:0;height:7px;
        background:linear-gradient(90deg,#ff5252,#ffca28,#66bb6a);
      }

      .crop-selector{
        position:fixed;inset:0;background:rgba(0,0,0,.85);
        display:flex;align-items:center;justify-content:center;z-index:9999;
      }
      .crop-box{
        background:#111;padding:16px;border-radius:20px;width:300px;text-align:center;
      }
      .crop-list{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;}
      .crop-btn{
        background:#1a1a1a;border:none;border-radius:14px;
        padding:10px;width:90px;color:#fff;cursor:pointer;
      }
    </style>

    <div class="home-wrapper">
      <div class="home-header">
        <h2>🌾 المزرعة</h2>
        <p>ازرع • انتظر • احصد</p>
      </div>

      <div class="game-box">
        <div class="farm-grid">
          ${farmState.plots.map((plot,i)=>{
            const elapsed = plot.planted ? now() - plot.startTime : 0;
            const remaining = plot.planted ? Math.max(0, plot.duration - elapsed) : 0;
            const progress = plot.planted ? Math.min(100,(elapsed / plot.duration)*100) : 0;
            const ready = plot.planted && remaining === 0;

            return `
              <div class="farm-plot" data-index="${i}">
                <div class="soil"></div>
                <div class="plant ${plot.anim} ${ready?"idle":""}">
                  ${plot.planted ? (ready ? plot.crop.icon : "🌱") : "🟫"}
                </div>
                ${plot.planted && !ready ? `<div class="timer">${remaining}s</div>` : ""}
                ${plot.planted ? `<div class="progress-bar" style="width:${progress}%"></div>` : ""}
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;

  bindFarmEvents();

  // ⛔ التايمر يشتغل فقط لو الصفحة الرئيسية مفتوحة
  if (
    isHomePage() &&
    farmState.plots.some(p => p.planted && now() - p.startTime < p.duration)
  ) {
    setTimeout(renderHome, 1000);
  }
}

/* =====================================================
   Farm Events
===================================================== */
function bindFarmEvents(){
  if (!isHomePage()) return;

  document.querySelectorAll(".farm-plot").forEach(el=>{
    el.onclick = ()=>{
      if (!isHomePage()) return;

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
   Crop Selector
===================================================== */
function openCropSelector(){
  if (!isHomePage()) return;

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
