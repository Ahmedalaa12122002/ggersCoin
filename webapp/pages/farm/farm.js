const landsDiv = document.getElementById("lands");
const user = Telegram.WebApp.initDataUnsafe.user;

fetch("/api/farm/lands", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: user.id })
})
.then(res => res.json())
.then(data => {
    landsDiv.innerHTML = "";

    data.lands.forEach(land => {
        const div = document.createElement("div");
        div.className = `land ${land.status}`;
        div.innerText = land.status === "open"
            ? `🌾 أرض ${land.land_id}`
            : `🔒 أرض ${land.land_id}`;
        landsDiv.appendChild(div);
    });
});
