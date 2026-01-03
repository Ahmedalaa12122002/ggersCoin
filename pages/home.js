function loadHome() {
  const content = document.getElementById('content');

  if (!localStorage.points) localStorage.points = 0;
  if (!localStorage.crop) localStorage.crop = '';
  if (!localStorage.endTime) localStorage.endTime = 0;

  render();
}

function render() {
  const content = document.getElementById('content');
  const now = Date.now();
  let html = `
  <div style="background:#111;border-radius:18px;padding:15px;max-width:420px;margin:auto">

    <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:10px">
      <span>👑 VIP: 0</span>
      <span>💰 النقاط: ${localStorage.points}</span>
    </div>

    <h2 style="text-align:center;margin:10px 0">🌾 WinHive</h2>

    <div style="text-align:center;font-size:60px">🌱</div>
  `;

  if (!localStorage.crop) {
    html += `
    <p style="text-align:center;margin:10px 0">اختر المحصول:</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
      ${cropBtn('قمح', 300)}
      ${cropBtn('جزر', 600)}
      ${cropBtn('فلفل', 900)}
      ${cropBtn('عنب', 1200)}
      ${cropBtn('جرجير', 1800)}
    </div>
    `;
  } else if (now < localStorage.endTime) {
    const left = Math.ceil((localStorage.endTime - now) / 1000);
    html += `
      <p style="text-align:center;margin:10px 0">🌱 الزراعة جارية (${localStorage.crop})</p>
      <p style="text-align:center">⏳ متبقي ${left} ثانية</p>
      <div style="height:8px;background:#333;border-radius:6px;overflow:hidden">
        <div style="width:${100 - (left / (localStorage.duration) * 100)}%;background:#f5c400;height:100%"></div>
      </div>
    `;
    setTimeout(render, 1000);
  } else {
    html += `
      <p style="text-align:center;margin:10px 0">🌾 جاهز للحصاد (${localStorage.crop})</p>
      <button onclick="harvest()" style="width:100%;padding:12px;border-radius:14px;background:#222;color:#fff;border:none">
        🔪 احصد
      </button>
    `;
  }

  html += `</div>`;
  content.innerHTML = html;
}

function cropBtn(name, time) {
  return `
    <button onclick="plant('${name}',${time})"
      style="padding:10px 14px;border-radius:14px;border:none;background:#222;color:#fff">
      ${name}
    </button>
  `;
}

function plant(name, time) {
  localStorage.crop = name;
  localStorage.duration = time;
  localStorage.endTime = Date.now() + time * 1000;
  render();
}

function harvest() {
  localStorage.points = parseInt(localStorage.points) + 5;
  localStorage.crop = '';
  localStorage.endTime = 0;
  render();
}
