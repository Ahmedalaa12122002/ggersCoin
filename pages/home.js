/* =========================================
   WinHive – Home (Farm System v5)
   PART 1 / 3
   Game Board + Realistic Farm Layout
========================================= */

/* ---------- بيانات أساسية ---------- */
const TOTAL_PLOTS = 6;

/* ---------- الحالة ---------- */
let state = {
  points: 0,
  vip: 0,        // من 0 إلى 5
  plots: []      // سيتم ملؤها لاحقًا
};

/* ---------- تحميل الصفحة ---------- */
function loadHome() {
  const saved = localStorage.getItem("winhive_farm_v5");
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
  localStorage.setItem("winhive_farm_v5", JSON.stringify(state));
}

/* ---------- رسم الواجهة ---------- */
function renderHome() {
  saveState();
  const content = document.getElementById("content");

  let html = `
  <style>
    /* ===== Game Board ===== */
    .farm-board{
      width:100%;
      max-width:420px;
      height:420px;
      margin:20px auto;
      background:linear-gradient(#6dbb4f,#4e8f3a);
      border-radius:20px;
      padding:16px;
      box-shadow:inset 0 0 30px rgba(0,0,0,.4);
      position:relative;
    }

    /* ===== Soil Plots ===== */
    .plot{
      width:100px;
      height:90px;
      background:linear-gradient(#5a3b1e,#3e2a15);
      border-radius:14px;
      box-shadow:inset 0 3px 5px rgba(0,0,0,.4);
      position:absolute;
      display:flex;
      justify-content:center;
      align-items:center;
      color:#fff;
      font-size:26px;
    }

    /* توزيع طبيعي للأراضي */
    .p0{ top:40px;  left:40px; }
    .p1{ top:40px;  right:40px; }
    .p2{ top:160px; left:160px; }

    .p3{ bottom:160px; left:40px; }
    .p4{ bottom:160px; right:40px; }
    .p5{ bottom:40px;  left:160px; }

    /* أرض مقفولة */
    .locked{
      background:linear-gradient(#444,#222);
      opacity:.8;
    }
  </style>

  <div style="max-width:420px;margin:auto;padding:10px">
    <div style="display:flex;justify-content:space-between;margin-bottom:6px">
      <div>💰 ${state.points}</div>
      <div>👑 VIP ${state.vip}</div>
    </div>

    <div class="farm-board">
  `;

  state.plots.forEach((plot, index) => {
    const unlocked = index < state.vip + 1;

    if (!unlocked) {
      html += `
        <div class="plot locked p${index}">
          🔒
        </div>
      `;
    } else {
      html += `
        <div class="plot p${index}">
          🟫
        </div>
      `;
    }
  });

  html += `
    </div>
  </div>
  `;

  content.innerHTML = html;
     }
/* =========================================
   WinHive – Home (Farm System v5)
   PART 2 / 3
   Planting + Growth Stages + Timer Overlay
========================================= */

/* ---------- المحاصيل ---------- */
const CROPS = [
  { id:"wheat",  name:"قمح",  time:5 },
  { id:"carrot", name:"جزر",  time:10 },
  { id:"pepper", name:"فلفل", time:15 },
  { id:"grape",  name:"عنب",  time:20 },
  { id:"rocket", name:"جرجير",time:30 }
];

/* ---------- رسم المزرعة (تحديث) ---------- */
function renderHome(){
  saveState();
  const content = document.getElementById("content");
  const now = Date.now();

  let html = `
  <style>
    .farm-board{
      width:100%;max-width:420px;height:420px;
      margin:20px auto;
      background:linear-gradient(#6dbb4f,#4e8f3a);
      border-radius:20px;padding:16px;
      box-shadow:inset 0 0 30px rgba(0,0,0,.4);
      position:relative;
    }
    .plot{
      width:100px;height:90px;
      background:linear-gradient(#5a3b1e,#3e2a15);
      border-radius:14px;
      position:absolute;
      display:flex;justify-content:center;align-items:center;
      font-size:26px;color:#fff;
    }
    .timer{
      position:absolute;top:-18px;
      background:rgba(0,0,0,.7);
      padding:2px 6px;
      border-radius:8px;
      font-size:11px;
    }
    .plant{font-size:28px;}
    .locked{background:linear-gradient(#444,#222);opacity:.8;}

    .p0{ top:40px;  left:40px; }
    .p1{ top:40px;  right:40px; }
    .p2{ top:160px; left:160px; }
    .p3{ bottom:160px; left:40px; }
    .p4{ bottom:160px; right:40px; }
    .p5{ bottom:40px;  left:160px; }
  </style>

  <div style="max-width:420px;margin:auto;padding:10px">
    <div style="display:flex;justify-content:space-between">
      <div>💰 ${state.points}</div>
      <div>👑 VIP ${state.vip}</div>
    </div>

    <div class="farm-board">
  `;

  state.plots.forEach((plot,index)=>{
    const unlocked = index < state.vip + 1;

    if(!unlocked){
      html += `<div class="plot locked p${index}">🔒</div>`;
      return;
    }

    if(!plot.crop){
      html += `
        <div class="plot p${index}" onclick="openPlantMenu(${index})">
          🟫
        </div>`;
      return;
    }

    const elapsed = (now - plot.plantedAt)/1000;
    const left = Math.ceil(plot.growTime - elapsed);

    if(elapsed < plot.growTime){
      let stage = "🌱";
      if(elapsed > plot.growTime*0.5) stage = "🌿";

      html += `
        <div class="plot p${index}">
          <div class="timer">${left}s</div>
          <div class="plant">${stage}</div>
        </div>`;
    }else{
      html += `
        <div class="plot p${index}" onclick="harvest(${index})">
          <div class="plant">🌾</div>
        </div>`;
    }
  });

  html += `
    </div>
  </div>
  `;

  content.innerHTML = html;

  if(state.plots.some(p=>p.crop && (Date.now()-p.plantedAt)/1000 < p.growTime)){
    setTimeout(renderHome,1000);
  }
}

/* ---------- زرع ---------- */
function openPlantMenu(index){
  let menu = `
  <div id="plantMenu" style="
    position:fixed;inset:0;
    background:rgba(0,0,0,.85);
    display:flex;justify-content:center;align-items:center;z-index:9999">
    <div style="background:#111;padding:14px;border-radius:14px;color:#fff;text-align:center">
      <h3>اختر محصول</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">
  `;

  CROPS.forEach(c=>{
    menu+=`
      <button onclick="plant(${index},'${c.id}',${c.time})"
        style="padding:8px 12px;border:none;border-radius:10px;background:#222;color:#fff">
        ${c.name}<br><small>${c.time}د</small>
      </button>`;
  });

  menu+=`
      </div>
      <button onclick="closePlantMenu()" style="margin-top:10px;background:none;border:none;color:#aaa">إلغاء</button>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend",menu);
}

function closePlantMenu(){
  document.getElementById("plantMenu")?.remove();
}

function plant(index,cropId,time){
  state.plots[index]={
    crop:cropId,
    plantedAt:Date.now(),
    growTime:time
  };
  closePlantMenu();
  renderHome();
}

/* ---------- حصاد ---------- */
function harvest(index){
  state.points+=1;
  state.plots[index]={crop:null,plantedAt:0,growTime:0};
  renderHome();
   }
/* =========================================
   WinHive – Home (Farm System v5 FINAL)
   Real Farm + Game Board + Growth + VIP
========================================= */

/* ---------- المحاصيل ---------- */
const CROPS = [
  { id:"wheat",  name:"قمح",  time:5 },
  { id:"carrot", name:"جزر",  time:10 },
  { id:"pepper", name:"فلفل", time:15 },
  { id:"grape",  name:"عنب",  time:20 },
  { id:"rocket", name:"جرجير",time:30 }
];

const TOTAL_PLOTS = 6;

/* ---------- VIP ---------- */
function vipConfig(level){
  return {
    plots: Math.min(1 + level, TOTAL_PLOTS),
    speed: level * 0.05 // تقليل وقت الزراعة
  };
}

/* ---------- الحالة ---------- */
let state = {
  points: 0,
  vip: 0,
  plots: []
};

/* ---------- تحميل ---------- */
function loadHome(){
  const saved = localStorage.getItem("winhive_farm_v5");
  if(saved){
    state = JSON.parse(saved);
  }else{
    initPlots();
    saveState();
  }
  renderHome();
}

/* ---------- تهيئة ---------- */
function initPlots(){
  state.plots=[];
  for(let i=0;i<TOTAL_PLOTS;i++){
    state.plots.push({crop:null,plantedAt:0,growTime:0});
  }
}

/* ---------- حفظ ---------- */
function saveState(){
  localStorage.setItem("winhive_farm_v5",JSON.stringify(state));
}

/* ---------- رسم ---------- */
function renderHome(){
  saveState();
  const content=document.getElementById("content");
  const now=Date.now();
  const vip=vipConfig(state.vip);

  let html=`
  <style>
    .farm-board{
      width:100%;max-width:420px;height:420px;
      margin:20px auto;
      background:linear-gradient(#6dbb4f,#4e8f3a);
      border-radius:20px;padding:16px;
      box-shadow:inset 0 0 30px rgba(0,0,0,.4);
      position:relative;
    }
    .plot{
      width:100px;height:90px;
      background:linear-gradient(#5a3b1e,#3e2a15);
      border-radius:14px;
      position:absolute;
      display:flex;justify-content:center;align-items:center;
      color:#fff;font-size:26px;
    }
    .soil{
      position:absolute;bottom:0;width:100%;height:35%;
      background:linear-gradient(#3e2a15,#2a1c0f);
      border-radius:0 0 14px 14px;
    }
    .timer{
      position:absolute;top:-18px;
      background:rgba(0,0,0,.75);
      padding:2px 6px;border-radius:8px;
      font-size:11px;
    }
    .plant{font-size:28px;}
    .locked{background:linear-gradient(#444,#222);opacity:.8;}
    .p0{top:40px;left:40px;}
    .p1{top:40px;right:40px;}
    .p2{top:160px;left:160px;}
    .p3{bottom:160px;left:40px;}
    .p4{bottom:160px;right:40px;}
    .p5{bottom:40px;left:160px;}
  </style>

  <div style="max-width:420px;margin:auto;padding:10px">
    <div style="display:flex;justify-content:space-between">
      <div>💰 ${state.points}</div>
      <div>👑 VIP ${state.vip}</div>
    </div>

    <div class="farm-board">
  `;

  state.plots.forEach((plot,index)=>{
    const unlocked=index<vip.plots;

    if(!unlocked){
      html+=`<div class="plot locked p${index}">🔒</div>`;
      return;
    }

    if(!plot.crop){
      html+=`
        <div class="plot p${index}" onclick="openPlantMenu(${index})">
          <div class="soil"></div>🟫
        </div>`;
      return;
    }

    const elapsed=(now-plot.plantedAt)/1000;
    const left=Math.ceil(plot.growTime-elapsed);

    if(elapsed<plot.growTime){
      let stage="🌱";
      if(elapsed>plot.growTime*0.5) stage="🌿";
      html+=`
        <div class="plot p${index}">
          <div class="timer">${left}s</div>
          <div class="soil"></div>
          <div class="plant">${stage}</div>
        </div>`;
    }else{
      html+=`
        <div class="plot p${index}" onclick="harvest(${index})">
          <div class="soil"></div>
          <div class="plant">🌾</div>
        </div>`;
    }
  });

  html+=`</div></div>`;
  content.innerHTML=html;

  if(state.plots.some(p=>p.crop && (Date.now()-p.plantedAt)/1000<p.growTime)){
    setTimeout(renderHome,1000);
  }
}

/* ---------- زرع ---------- */
function openPlantMenu(index){
  let menu=`
  <div id="plantMenu" style="position:fixed;inset:0;
    background:rgba(0,0,0,.85);display:flex;
    justify-content:center;align-items:center;z-index:9999">
    <div style="background:#111;padding:14px;border-radius:14px;color:#fff;text-align:center">
      <h3>اختر محصول</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">
  `;

  const speed=vipConfig(state.vip).speed;

  CROPS.forEach(c=>{
    const time=Math.max(1,Math.round(c.time*(1-speed)));
    menu+=`
      <button onclick="plant(${index},'${c.id}',${time})"
        style="padding:8px 12px;border:none;border-radius:10px;background:#222;color:#fff">
        ${c.name}<br><small>${time}د</small>
      </button>`;
  });

  menu+=`
      </div>
      <button onclick="closePlantMenu()" style="margin-top:10px;background:none;border:none;color:#aaa">
        إلغاء
      </button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML("beforeend",menu);
}

function closePlantMenu(){
  document.getElementById("plantMenu")?.remove();
}

function plant(index,cropId,time){
  state.plots[index]={crop:cropId,plantedAt:Date.now(),growTime:time};
  closePlantMenu();
  renderHome();
}

/* ---------- حصاد ---------- */
function harvest(index){
  state.points+=1;
  state.plots[index]={crop:null,plantedAt:0,growTime:0};
  renderHome();
   }
