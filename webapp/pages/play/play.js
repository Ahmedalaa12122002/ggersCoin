document.addEventListener("DOMContentLoaded", loadLands);

async function loadLands() {
    const tgUser = JSON.parse(localStorage.getItem("tg_user"));
    const userId = tgUser?.id || 1;
    const isVip = false; // لاحقًا من API VIP

    const res = await fetch(`/api/farm/lands?user_id=${userId}&vip=${isVip}`);
    const data = await res.json();

    const container = document.getElementById("lands");
    container.innerHTML = "";

    data.lands.forEach(land => {
        const div = document.createElement("div");
        div.className = `land ${land.status}`;

        if (land.status === "open") {
            div.textContent = `🌱 أرض ${land.id}`;
        } else {
            div.textContent = `🔒 أرض ${land.id}`;
        }

        container.appendChild(div);
    });
}
