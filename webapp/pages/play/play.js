async function loadFarmLands() {
    const view = document.getElementById("view");

    view.innerHTML = `
        <div id="farm">
            🌱 جاري تحميل الأراضي...
        </div>
    `;

    try {
        const res = await fetch("/api/farm/lands");
        if (!res.ok) throw new Error("API error");

        const data = await res.json();

        if (!data.success) {
            view.innerHTML = "❌ فشل تحميل الأراضي";
            return;
        }

        view.innerHTML = `
            <h2>🌱 المزرعة</h2>
            <div class="lands">
                ${data.lands.map(land => `
                    <div class="land ${land.unlocked ? "open" : "locked"}">
                        <h3>أرض ${land.id}</h3>
                        <p>
                            ${land.unlocked ? "🌿 متاحة" : "🔒 VIP"}
                        </p>
                    </div>
                `).join("")}
            </div>
        `;
    } catch (e) {
        console.error(e);
        view.innerHTML = "❌ فشل تحميل الأراضي";
    }
}

loadFarmLands();
