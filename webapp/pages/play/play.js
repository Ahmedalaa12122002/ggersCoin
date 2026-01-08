async function loadFarmLands() {
    const container = document.getElementById("play");

    if (!container) {
        console.error("❌ عنصر play غير موجود");
        return;
    }

    container.innerHTML = "🌱 جاري تحميل الأراضي...";

    try {
        const res = await fetch("/api/farm/lands");
        if (!res.ok) throw new Error("API error");

        const data = await res.json();

        if (!data.success) {
            container.innerHTML = "❌ فشل تحميل الأراضي";
            return;
        }

        container.innerHTML = `
            <div class="lands">
                ${data.lands.map(land => `
                    <div class="land ${land.unlocked ? "open" : "locked"}">
                        <h3>أرض ${land.id}</h3>
                        <p>${land.unlocked ? "🌿 متاحة" : "🔒 VIP"}</p>
                    </div>
                `).join("")}
            </div>
        `;
    } catch (e) {
        console.error(e);
        container.innerHTML = "❌ فشل تحميل الأراضي";
    }
}

loadFarmLands();
