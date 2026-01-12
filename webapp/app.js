const content = document.getElementById("content");

function show(page) {
  const titles = {
    profile: "👤 حسابي",
    wallet: "💼 المحفظة",
    vip: "⭐ VIP",
    play: "🎮 Play",
    tasks: "📋 المهمات",
    referral: "👥 الإحالة",
    history: "📜 سجل المعلومات"
  };

  content.innerHTML = `
    <h2>${titles[page]}</h2>
    <p>هذه صفحة ${titles[page]}</p>
  `;
}
