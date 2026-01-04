// Timer Engine - لا يرسم أي HTML
setInterval(()=>{
  const raw = localStorage.getItem("winhive_farm_v2");
  if(!raw) return;

  const state = JSON.parse(raw);
  let changed = false;
  const now = Math.floor(Date.now()/1000);

  state.plots.forEach(p=>{
    if(p.crop && !p.ready){
      if(now - p.planted >= p.crop.time){
        p.ready = true;
        changed = true;
      }
    }
  });

  if(changed){
    localStorage.setItem("winhive_farm_v2", JSON.stringify(state));
    if(window.currentPage === "home"){
      renderHome();
    }
  }
},1000);
