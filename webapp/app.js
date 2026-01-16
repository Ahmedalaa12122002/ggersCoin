const tg = window.Telegram?.WebApp;

const loading = document.getElementById("loading");
const blocked = document.getElementById("blocked");
const app = document.getElementById("app");

if (!tg || !tg.initData) {
  loading.style.display = "none";
  blocked.style.display = "block";
  throw new Error("Not Telegram WebApp");
}

tg.ready();

const user = tg.initDataUnsafe?.user;

if (!user) {
  loading.style.display = "none";
  blocked.style.display = "block";
  throw new Error("No user data");
}

loading.style.display = "none";
app.style.display = "block";
document.getElementById("username").innerText = user.first_name;

// auth
fetch("/api/auth", {
  method: "POST",
  headers: {"Content-Type":"application/json"},
  body: JSON.stringify({
    initData: tg.initData,
    device_id: tg.platform + "-" + navigator.userAgent
  })
})
.then(r=>r.json())
.then(d=>{
  if(d.error){
    alert(d.error);
    tg.close();
  }
});
