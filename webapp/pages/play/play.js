async function loadFarm() {
    const container = document.getElementById("play-content");

    container.innerHTML = "🌱 جاري تحميل الأراضي...";

    try {
        const res = await fetch("/api/farm/lands");

        if (!res.ok) {
            throw new Error("HTTP ERROR");
        }

        const data = await res.json();

        if (!data.success) {
            throw new Error("API FAILED");
        }

        renderLands(data.lands);

    } catch (e) {
        console.error(e);
        container.innerHTML = "❌ فشل تحميل الأراضي";
    }
}

function renderLands(lands) {
    const container = document.getElementById("play-content");

    container.innerHTML = `
        <h3>🌱 المزرعة</h3>
        <div class="lands"></div>
    `;

    const grid = container.querySelector(".lands");

    lands.forEach(land => {
        const div = document.createElement("div");
        div.className = "land";

        if (!land.unlocked) {
            div.classList.add("locked");
            div.innerText = "🔒 VIP";
        } else {
            div.innerText = "🌾 أرض " + land.id;
        }

        grid.appendChild(div);
    });
}

/* تشغيل عند فتح Play */
loadFarm();
