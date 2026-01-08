window.loadLands = async function () {
    const container = document.getElementById("lands");
    container.innerHTML = "⏳ تحميل الأراضي...";

    try {
        const res = await fetch("/api/farm/lands");
        const data = await res.json();

        container.innerHTML = "";
        data.lands.forEach(land => {
            const div = document.createElement("div");
            div.className = "land " + (land.locked ? "locked" : "open");
            div.textContent = land.locked
                ? `أرض ${land.id} 🔒 VIP`
                : `أرض ${land.id} 🌱`;

            container.appendChild(div);
        });

    } catch (err) {
        container.innerHTML = "❌ فشل الاتصال بالسيرفر";
        console.error(err);
    }
};
