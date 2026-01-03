// ===============================
// صفحة الرئيسية (المزرعة)
// ===============================

if (!window.pages) window.pages = {};

window.pages.home = function () {
  const content = document.getElementById("content");

  // حالة المزرعة (مؤقتة – بدون DB)
  if (!window.farmState) {
    window.farmState = {
      points: 0,
      vip: 0,
      lands: [
        { status: "empty", crop: null, end: 0 },
        { status: "locked", crop: null, end: 0 },
        { status: "locked", crop: null, end: 0 },
        { status: "locked", crop: null, end: 0 },
        { status: "locked", crop: null, end: 0 },
        { status: "locked", crop: null, end: 0 }
      ]
    };
  }

  const crops = {
    wheat:  { name: "قمح 🌾", time: 5, reward: 5 },
    carrot: { name: "جزر 🥕", time: 10, reward: 10 },
    pepper: { name: "فلفل 🌶️", time: 15, reward: 15 }
  };

  let selectedLand = null;

  // ===== رسم الصفحة =====
  function render() {
    content.innerHTML = `
      <div class="farm">
        <div style="display:flex;justify-content:space-between;margin-bottom:10px">
          <div>💰 النقاط: ${farmState.points}</div>
          <div>👑 VIP: ${farmState.vip}</div>
        </div>

        <div class="land-grid">
          ${farmState.lands.map(renderLand).join("")}
        </div>
      </div>

      <div id="cropMenu" style="
        position:fixed;
        bottom:110px;
        left:0;right:0;
        background:#111;
        padding:15px;
        border-radius:20px 20px 0 0;
        display:none;
        z-index:20;
      ">
        ${Object.keys(crops).map(c =>
          `<div class="crop-btn" onclick="selectCrop('${c}')">
            ${crops[c].name} (${crops[c].time} دقائق)
          </div>`
        ).join("")}
        <div class="crop-btn" onclick="closeCropMenu()">إلغاء</div>
      </div>
    `;
  }

  // ===== رسم قطعة أرض =====
  function renderLand(land, index) {
    if (land.status === "locked") {
      return `<div class="land locked">🔒 VIP</div>`;
    }

    if (land.status === "empty") {
      return `
        <div class="land" onclick="openCropMenu(${index})">
          🌱
          <div class="time">ازرع</div>
        </div>
      `;
    }

    if (land.status === "planted") {
      const left = Math.max(
        0,
        Math.ceil((land.end - Date.now()) / 1000)
      );

      if (left === 0) {
        land.status = "ready";
        return `
          <div class="land ready" onclick="harvest(${index})">
            🌾
            <div class="time">احصد</div>
          </div>
        `;
      }

      return `
        <div class="land">
          ⏳
          <div class="time">${left}ث</div>
        </div>
      `;
    }

    if (land.status === "ready") {
      return `
        <div class="land ready" onclick="harvest(${index})">
          🌾
          <div class="time">احصد</div>
        </div>
      `;
    }
  }

  // ===== فتح اختيار المحصول =====
  window.openCropMenu = function (index) {
    selectedLand = index;
    document.getElementById("cropMenu").style.display = "block";
  };

  window.closeCropMenu = function () {
    document.getElementById("cropMenu").style.display = "none";
    selectedLand = null;
  };

  // ===== زرع =====
  window.selectCrop = function (type) {
    if (selectedLand === null) return;

    const crop = crops[type];
    farmState.lands[selectedLand] = {
      status: "planted",
      crop: type,
      end: Date.now() + crop.time * 60000
    };

    closeCropMenu();
    render();
  };

  // ===== حصاد =====
  window.harvest = function (index) {
    const land = farmState.lands[index];
    const crop = crops[land.crop];

    farmState.points += crop.reward;
    farmState.lands[index] = { status: "empty", crop: null, end: 0 };

    render();
  };

  // تحديث تلقائي للوقت
  setInterval(() => {
    if (document.querySelector(".nav-btn.active")?.dataset.page === "home") {
      render();
    }
  }, 1000);

  // بدء
  render();
};
