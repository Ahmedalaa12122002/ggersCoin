async function loadFarmLands() {
    const container = document.getElementById("play");
    container.innerHTML = "🌱 جاري تحميل الأراضي...";

    try {
        const res = await fetch("/api/farm/lands");
        if (!res.ok) throw new Error("API Error");

        const data = await res.json();

        if (!data.lands || data.lands.length === 0) {
            container.innerHTML = "❌ لا توجد أراضي";
            return;
        }

        container.innerHTML = `
            <div class="lands">
                ${data.lands.map(land => `
                    <div class="land ${land.unlocked ? 'open' : 'locked'}">
                        <h3>أرض ${land.id}</h3>
                        <p>${land.unlocked ? "🌱 مفتوحة" : "🔒 VIP"}</p>
                    </div>
                `).join("")}
            </div>
        `;
    } catch (e) {
        container.innerHTML = "❌ فشل تحميل الأراضي";
        console.error(e);
    }
}

loadFarmLands();
