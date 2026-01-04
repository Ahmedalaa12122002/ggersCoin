const TOTAL_PLOTS = 6;
const STORAGE_KEY = "winhive_farm_v1";

const CROPS = [
  {id:"wheat", name:"قمح", time:15, icon:"🌾"},
  {id:"carrot", name:"جزر", time:30, icon:"🥕"},
  {id:"pepper", name:"فلفل", time:45, icon:"🌶️"}
];

let farmState = {
  vip:0,
  plots:[]
};

/* ===== INIT ===== */
function initFarm(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){
    farmState = JSON.parse(saved);
  }else{
    farmState.plots = [];
    for(let i=0;i<TOTAL_PLOTS;i++){
      farmState.plots.push({crop:null, planted:0});
    }
    saveFarm();
  }
}

function saveFarm(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(farmState));
}

/* ===== RENDER ===== */
function renderHome(){
  if(window.currentPage !== "home") return;

  initFarm();

  let html = `<div class="fade">
    <h3 style="text-align:center">🌱 المزرعة</h3>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">`;

  farmState.plots.forEach((p,i)=>{
    const unlocked = i === 0 || farmState.vip > 0;

    if(!unlocked){
      html += `
        <div style="background:#222;padding:22px;text-align:center;border-radius:14px">
          🔒 VIP
        </div>`;
      return;
    }

    if(!p.crop){
      html += `
        <button onclick="openPlant(${i})"
        style="background:#3a2;padding:22px;border-radius:14px;border:none;color:#fff">
          🟫 ازرع
        </button>`;
    }else{
      const remain = Math.max(
        0,
        p.crop.time - Math.floor(Date.now()/1000 - p.planted)
      );

      if(remain > 0){
        html += `
          <div style="background:#2a3;padding:22px;border-radius:14px;text-align:center">
            ${p.crop.icon}<br>${remain}s
          </div>`;
      }else{
        html += `
          <button onclick="harvest(${i})"
          style="background:#6a4;padding:22px;border-radius:14px;border:none">
            🌾 احصد
          </button>`;
      }
    }
  });

  html += `</div></div>`;
  document.getElementById("content").innerHTML = html;

  setTimeout(()=>{
    if(window.currentPage === "home"){
      renderHome();
    }
  },1000);
}

/* ===== ACTIONS ===== */
function openPlant(i){
  let html = `
  <div style="
    position:fixed;inset:0;
    background:rgba(0,0,0,.85);
    display:flex;justify-content:center;align-items:center">
    <div style="background:#111;padding:20px;border-radius:14px">`;

  CROPS.forEach(c=>{
    html += `
      <button onclick="plant(${i},'${c.id}')"
      style="margin:6px;padding:12px">
        ${c.icon} ${c.name}
      </button>`;
  });

  html += `
      <br>
      <button onclick="closePlant()">إلغاء</button>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", html);
}

function closePlant(){
  document.body.lastChild.remove();
}

function plant(i,id){
  const crop = CROPS.find(c=>c.id===id);
  farmState.plots[i] = {
    crop,
    planted:Math.floor(Date.now()/1000)
  };
  saveFarm();
  closePlant();
  renderHome();
}

function harvest(i){
  farmState.plots[i] = {crop:null,planted:0};
  saveFarm();
  renderHome();
}
