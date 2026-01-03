/* ==============================
   إعدادات عامة
============================== */

// ضع رابط إعلان Adsterra هنا
const AD_URL = "https://your-adsterra-link.com";

// حالة المزرعة (مؤقتة بدون قاعدة بيانات)
let farmState = {
  points: 0,
  crop: null,
  plantedAt: 0,
  growTime: 0
};

/* ==============================
   تحميل الصفحة الرئيسية
============================== */

function loadHome() {
  if (!localStorage.farmState) {
    localStorage.farmState = JSON.stringify(farmState);
  } else {
    farmState = JSON.parse(localStorage.farmState);
  }
  renderHome();
}

/* ==============================
   رسم الواجهة
============================== */

function renderHome() {
  localStorage.farmState = JSON.stringify(farmState);

  const content = document.getElementById("content");
  const now = Date.now();

  let html = `
  <div style="max-width:420px;margin:auto;padding:14px">

    <div style="display:flex;justify-content:space-between;margin-bottom:10px">
      <div>💰 النقاط: ${farmState.points}</div>
      <div>👑 VIP: 0</div>
    </div>

    <h2 style="text-align:center;margin-bottom:12px">🌾 WinHive</h2>

    <div style="background:#111;border-radius:18px;padding:16px;text-align:center">
      <div style="font-size:64px;margin-bottom:8px">🌱</div>
  `;

  // لا يوجد محصول
  if (!farmState.crop) {
    html += `
      <p>اختر محصولًا للزراعة</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">
        ${cropButton("قمح", 5)}
        ${cropButton("جزر", 10)}
        ${cropButton("فلفل", 15)}
        ${cropButton("عنب", 20)}
        ${cropButton("جرجير", 30)}
      </div>
    `;
  } 
  // في مرحلة النمو
  else if (now - farmState.plantedAt < farmState.growTime * 1000) {
    const left = Math.ceil(
      (farmState.growTime * 1000 - (now - farmState.plantedAt)) / 1000
    );

    html += `
      <p>🌱 ${farmState.crop} قيد النمو</p>
      <p>⏳ متبقي ${left} ثانية</p>
      <div style="height:8px;background:#333;border-radius:6px;overflow:hidden">
        <div style="
          height:100%;
          width:${100 - (left / farmState.growTime) * 100}%;
          background:#f5c400">
        </div>
      </div>
    `;
  } 
  // جاهز للحصاد
  else {
    html += `
      <p>🌾 ${farmState.crop} جاهز للحصاد</p>
      <button onclick="harvestWithAdBonus()" style="
        width:100%;
        padding:14px;
        margin-top:10px;
        border:none;
        border-radius:14px;
        background:#f5c400;
        color:#000;
        font-size:16px
      ">
        🌾 احصد + مكافأة
      </button>
    `;
  }

  html += `
    </div>
  </div>
  `;

  content.innerHTML = html;

  // تحديث تلقائي أثناء النمو
  if (farmState.crop && now - farmState.plantedAt < farmState.growTime * 1000) {
    setTimeout(renderHome, 1000);
  }
}

/* ==============================
   أزرار المحاصيل
============================== */

function cropButton(name, minutes) {
  return `
    <button onclick="plantCrop('${name}', ${minutes})"
      style="
        padding:10px 14px;
        border-radius:12px;
        border:none;
        background:#222;
        color:#fff
      ">
      ${name}
    </button>
  `;
}

function plantCrop(name, minutes) {
  farmState.crop = name;
  farmState.plantedAt = Date.now();
  farmState.growTime = minutes;
  renderHome();
}

/* ==============================
   الحصاد + نظام الإعلان
============================== */

function harvestWithAdBonus() {
  startAdReward(() => {
    farmState.points += 10; // مكافأة إضافية
    farmState.crop = null;
    farmState.plantedAt = 0;
    farmState.growTime = 0;
    alert("🎉 تم استلام المكافأة");
    renderHome();
  });
}

/* ==============================
   نظام الإعلان (محمي)
============================== */

function startAdReward(onSuccess) {
  window.open(AD_URL, "_blank");

  const session = {
    active: true,
    confirmed: false
  };

  showAdWaiting(session, onSuccess);
}

function showAdWaiting(session, onSuccess) {
  let seconds = 20;

  const overlay = document.createElement("div");
  overlay.id = "adOverlay";
  overlay.style = `
    position:fixed;inset:0;
    background:rgba(0,0,0,.9);
    color:#fff;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    z-index:9999;
    text-align:center
  `;

  overlay.innerHTML = `
    <h2>⏳ انتظر قليلًا</h2>
    <p>يتم تجهيز المكافأة</p>
    <h1 id="adCounter">${seconds}</h1>
  `;

  document.body.appendChild(overlay);

  const timer = setInterval(() => {
    seconds--;
    document.getElementById("adCounter").innerText = seconds;

    if (seconds <= 0) {
      clearInterval(timer);
      overlay.remove();
      showClaimReward(session, onSuccess);
    }
  }, 1000);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      cancelAdSession(session);
    }
  }, { once: true });
}

function showClaimReward(session, onSuccess) {
  const overlay = document.createElement("div");
  overlay.id = "claimOverlay";
  overlay.style = `
    position:fixed;inset:0;
    background:rgba(0,0,0,.9);
    color:#fff;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    z-index:9999;
    text-align:center
  `;

  overlay.innerHTML = `
    <h2>⚠️ تنبيه</h2>
    <p>تم تجهيز مكافأتك</p>
    <p>⏰ يجب استلام المكافأة خلال ساعة</p>
    <button id="claimBtn" style="
      padding:14px 26px;
      border:none;
      border-radius:14px;
      background:#f5c400;
      color:#000;
      font-size:16px;
      margin-top:12px
    ">
      🎁 استلام المكافأة
    </button>
  `;

  document.body.appendChild(overlay);

  document.getElementById("claimBtn").onclick = () => {
    if (!session.active) return;
    session.confirmed = true;
    overlay.remove();
    onSuccess();
  };

  setTimeout(() => {
    if (!session.confirmed) {
      cancelAdSession(session);
    }
  }, 60 * 60 * 1000);
}

function cancelAdSession(session) {
  session.active = false;
  document.getElementById("adOverlay")?.remove();
  document.getElementById("claimOverlay")?.remove();
  alert("❌ تم إلغاء المكافأة");
}
