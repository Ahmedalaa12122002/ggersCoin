document.addEventListener("DOMContentLoaded", () => {
    loadFarmLands();
});

async function loadFarmLands() {
    const container = document.getElementById("play");

    container.innerHTML = `
        <h2>🌱 المزرعة</h2>
        <p>جاري تحميل الأراضي...</p>
    `;

    try {
        const res = await fetch("/api/farm/lands", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error("HTTP ERROR");
        }

        const data = await res.json();

        if (!data.success) {
            throw new Error("API ERROR");
        }

        renderLands(data.lands);

    } catch (err) {
        console.error(err);
        container.innerHTML = `
            <h2>🌱 المزرعة</h2>
            <p style="color:red">❌ فشل تحميل الأراضي</p>
        `;
    }
}

function renderLands(lands) {
    const container = document.getElementById("play");

    let html = `<div class="lands">`;

    lands.forEach((land, index) => {
        if (land.open) {
            html += `
                <div class="land open">
                    🌾 أرض ${index + 1}
                </div>
            `;
        } else {
            html += `
                <div class="land locked">
                    🔒 أرض ${index + 1}<br>
                    <small>VIP</small>
                </div>
            `;
        }
    });

    html += `</div>`;
    container.innerHTML = html;
}
