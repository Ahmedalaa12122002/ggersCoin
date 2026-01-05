/* =====================================================
   Home Page – Stage 1 (SAFE BASE)
   WinHive
   ===================================================== */

/*
  هذا الملف مسؤول فقط عن:
  - عرض محتوى الصفحة الرئيسية
  - أرض واحدة
  - زر واحد (ازرع)
  بدون أي منطق وقت أو VIP
*/

/* حالة بسيطة للمرحلة الأولى */
let homeState = {
  planted: false
};

/* الدالة التي يستدعيها main.js */
function renderHomePage() {
  const content = document.getElementById("content");
  if (!content) return;

  // مسح أي محتوى قديم
  content.innerHTML = "";

  // إنشاء الحاوية
  const wrapper = document.createElement("div");
  wrapper.style.maxWidth = "420px";
  wrapper.style.margin = "0 auto";
  wrapper.style.padding = "20px";
  wrapper.style.textAlign = "center";

  // العنوان
  const title = document.createElement("h2");
  title.textContent = "🌱 المزرعة";
  title.style.marginBottom = "20px";
  wrapper.appendChild(title);

  // الأرض
  const plot = document.createElement("div");
  plot.style.height = "140px";
  plot.style.borderRadius = "16px";
  plot.style.background = homeState.planted
    ? "linear-gradient(#4caf50, #2e7d32)"
    : "linear-gradient(#5d4037, #3e2723)";
  plot.style.display = "flex";
  plot.style.alignItems = "center";
  plot.style.justifyContent = "center";
  plot.style.fontSize = "40px";
  plot.style.marginBottom = "20px";
  plot.textContent = homeState.planted ? "🌿" : "🟫";
  wrapper.appendChild(plot);

  // زر الزراعة
  const button = document.createElement("button");
  button.textContent = homeState.planted ? "تم الزرع ✅" : "ازرع";
  button.disabled = homeState.planted;
  button.style.width = "100%";
  button.style.padding = "14px";
  button.style.fontSize = "16px";
  button.style.border = "none";
  button.style.borderRadius = "12px";
  button.style.cursor = homeState.planted ? "default" : "pointer";
  button.style.background = homeState.planted ? "#555" : "#ffd54f";
  button.style.color = "#000";

  button.onclick = () => {
    homeState.planted = true;
    renderHomePage();
  };

  wrapper.appendChild(button);

  // إدخال كل شيء في الصفحة
  content.appendChild(wrapper);
}

/* حماية: لا يتم التشغيل تلقائياً */
