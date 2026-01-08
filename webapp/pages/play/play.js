fetch("/api/farm/lands")
  .then(res => res.json())
  .then(data => {
      const div = document.getElementById("lands");
      div.innerHTML = "";
      data.lands.forEach(l => {
          div.innerHTML += `<div>${l.id} - ${l.locked ? "🔒" : "🌱"}</div>`;
      });
  });
