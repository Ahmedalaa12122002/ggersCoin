fetch("/api/farm/lands")
.then(res => res.json())
.then(data => {
    const box = document.getElementById("lands");
    box.innerHTML = "";

    data.lands.forEach(land => {
        const div = document.createElement("div");
        div.className = land.open ? "land open" : "land locked";
        div.innerText = land.open ? "🌱 أرض مفتوحة" : "🔒 أرض مقفولة";
        box.appendChild(div);
    });
});
