document.addEventListener("DOMContentLoaded", loadLands);

async function loadLands() {
    const container = document.getElementById("lands");

    try {
        const res = await fetch("/api/farm/lands");
        const data = await res.json();

        container.innerHTML = "";

        data.lands.forEach(land => {
            const div = document.createElement("div");
            div.classList.add("land");

            if (land.locked) {
                div.classList.add("locked");
                div.textContent = `أرض ${land.id} 🔒 (VIP)`;
            } else {
                div.classList.add("open");
                div.textContent = `أرض ${land.id} 🌱`;
            }

            container.appendChild(div);
        });

    } catch (e) {
        container.innerHTML = "❌ فشل تحميل الأراضي";
        console.error(e);
    }
        }
