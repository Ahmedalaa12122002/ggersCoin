const STORAGE_KEY = "winhive_farm_v2";

const CROPS = [
  {id:"wheat", name:"قمح", time:15, icon:"🌾"},
  {id:"carrot", name:"جزر", time:30, icon:"🥕"},
  {id:"pepper", name:"فلفل", time:45, icon:"🌶️"}
];

function getState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw) return JSON.parse(raw);

  return {
    vip:0,
    plots:Array.from({length:6},()=>({
      crop:null,
      planted:0,
      ready:false
    }))
  };
}

function saveState(s){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function renderHome(){
  const state = getState();
  let html = `<div class="fade">
    <h3 style="text-align:center">🌱 المزرعة</h3>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">`;

  state.plots.forEach((p,i)=>{
    const unlocked = i===0 || state.vip>0;

    if(!unlocked){
      html+=`<div style="background:#222;padding:22px;border-radius:14px;text-align:center">🔒 VIP</div>`;
      return;
    }

    if(!p.crop){
      html+=`<button onclick="plant(${i})"
        style="background:#3a2;padding:22px;border-radius:14px;border:none;color:#fff">
        🟫 ازرع
      </button>`;
    }else if(!p.ready){
      html+=`<div style="background:#2a3;padding:22px;border-radius:14px;text-align:center">
        ${p.crop.icon}<br>ينمو...
      </div>`;
    }else{
      html+=`<button onclick="harvest(${i})"
        style="background:#6a4;padding:22px;border-radius:14px;border:none">
        🌾 احصد
      </button>`;
    }
  });

  html+=`</div></div>`;
  document.getElementById("content").innerHTML = html;
}

function plant(i){
  const state = getState();
  state.plots[i] = {
    crop:CROPS[0],
    planted:Math.floor(Date.now()/1000),
    ready:false
  };
  saveState(state);
  renderHome();
}

function harvest(i){
  const state = getState();
  state.plots[i] = {crop:null,planted:0,ready:false};
  saveState(state);
  renderHome();
}
