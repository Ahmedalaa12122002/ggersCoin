const tg = window.Telegram?.WebApp;

const loading = document.getElementById("loading");
const blocked = document.getElementById("blocked");
const app = document.getElementById("app");

if (!tg || !tg.initData) {
  loading.style.display = "none";
  blocked.style.display = "block";
  blocked.innerText = "❌ افتح التطبيق من داخل Telegram فقط";
  throw new Error("Not Telegram WebApp");
}

tg.ready();

const user = tg.initDataUnsafe?.user;

if (!user) {
  loading.style.display = "none";
  blocked.style.display = "block";
  blocked.innerText = "❌ لا يمكن قراءة بيانات المستخدم";
  throw new Error("No user data");
}

fetch("/api/auth", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    initData: tg.initData,
    device_id: tg.platform + "_" + navigator.userAgent
  })
})
.then(res => {
  if (!res.ok) throw new Error("Server error");
  return res.json();
})
.then(data => {
  if (data.error) {
    alert(data.error);
    tg.close();
    return;
  }

  loading.style.display = "none";
  app.style.display = "block";
  document.getElementById("username").innerText = user.first_name;
})
.catch(err => {
  loading.style.display = "none";
  blocked.style.display = "block";
  blocked.innerText = "❌ فشل الاتصال بالسيرفر";
  console.error(err);
});
