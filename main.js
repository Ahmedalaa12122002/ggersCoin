/* =====================================================
   WinHive - Main Navigation Controller
   مسؤول فقط عن:
   - التنقل بين القوائم
   - التحكم في الصفحة النشطة
   - استدعاء المزرعة من home.page.js
===================================================== */

/* ---------- Helpers ---------- */
const content = document.getElementById("content");
const navButtons = document.querySelectorAll(".nav-btn");

/* ---------- UI Reset ---------- */
function clearContent() {
  // مسح أي محتوى قديم (يمنع التداخل)
  content.innerHTML = "";
}

/* ---------- Nav Highlight ---------- */
function setActiveNav(index) {
  navButtons.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

/* =====================================================
   PAGES
===================================================== */

/* ---------- HOME (Farm) ---------- */
function goHome() {
  clearContent();
  setActiveNav(0);

  // تأكيد أن renderHome موجود
  if (typeof renderHome !== "function") {
    content.innerHTML = `
      <div class="page-box">
        ❌ خطأ: لم يتم تحميل المزرعة
      </div>`;
    return;
  }

  // رسم المزرعة
  renderHome();
}

/* ---------- TASKS ---------- */
function goTasks() {
  clearContent();
  setActiveNav(1);

  content.innerHTML = `
    <div class="page-box">
      📋 <b>المهام</b><br><br>
      قريبًا سيتم إضافة مهام تفاعلية مرتبطة بالمزرعة 🌱
    </div>`;
}

/* ---------- WALLET ---------- */
function goWallet() {
  clearContent();
  setActiveNav(2);

  content.innerHTML = `
    <div class="page-box">
      💼 <b>المحفظة</b><br><br>
      النقاط الحالية: <b>${window.state ? state.points : 0}</b>
    </div>`;
}

/* ---------- VIP ---------- */
function goVip() {
  clearContent();
  setActiveNav(3);

  content.innerHTML = `
    <div class="page-box">
      👑 <b>نظام VIP</b><br><br>
      المستوى الحالي: <b>${window.state ? state.vipLevel : 0}</b><br><br>
      فتح مزارع إضافية ⛏️<br>
      تقليل وقت الزراعة ⏱️<br>
      زيادة المكافآت 🎁
    </div>`;
}

/* ---------- SETTINGS ---------- */
function goSettings() {
  clearContent();
  setActiveNav(4);

  content.innerHTML = `
    <div class="page-box">
      ⚙️ <b>الإعدادات</b><br><br>
      سيتم إضافة:
      <ul style="text-align:right">
        <li>اللغة</li>
        <li>الصوت</li>
        <li>الدعم</li>
      </ul>
    </div>`;
}

/* =====================================================
   SAFE START
===================================================== */

(function startApp(){
  try {
    // افتح الرئيسية تلقائيًا
    goHome();
    console.log("✅ main.js loaded successfully");
  } catch (e) {
    console.error("❌ main.js error", e);
    content.innerHTML = `
      <div class="page-box">
        ❌ حدث خطأ أثناء تشغيل التطبيق
      </div>`;
  }
})();
