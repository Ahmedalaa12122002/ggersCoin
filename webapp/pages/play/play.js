async function loadFarmLands() {
    const container = document.getElementById("play");

    if (!container) {
        console.error("❌ عنصر play غير موجود");
        return;
    }

    container.innerHTML = "🌱 جاري تحميل الأراضي...";

    try {
        const API_URL = `${window.location.origin}/api/farm/lands`;

        const res = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error("API request failed");
        }

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
    } catch (err) {
        console.error("❌ Farm API Error:", err);
        container.innerHTML = "❌ فشل تحميل الأراضي";
    }
}

loadFarmLands();
