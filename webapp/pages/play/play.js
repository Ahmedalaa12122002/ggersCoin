fetch("/api/farm/lands")
  .then(res => res.json())
  .then(data => {
    const landsDiv = document.getElementById("lands");
    landsDiv.innerHTML = "";

    data.lands.forEach(land => {
      const div = document.createElement("div");
      div.textContent = `أرض ${land.id} ${land.locked ? "🔒 VIP" : "🌱 متاحة"}`;
      div.style.padding = "10px";
      landsDiv.appendChild(div);
    });
  })
  .catch(() => {
    document.getElementById("lands").textContent =
      "❌ فشل تحميل الأراضي";
  });
