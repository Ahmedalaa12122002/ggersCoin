const tg = window.Telegram?.WebApp;

// ❌ لو مش داخل Telegram
if (!tg || !tg.initData) {
  document.getElementById("blocked").style.display = "block";
  throw new Error("Not Telegram WebApp");
}

// لازم نعمل ready
tg.ready();

// بيانات المستخدم
const user = tg.initDataUnsafe?.user;

// لو مفيش user
if (!user) {
  document.getElementById("blocked").style.display = "block";
  throw new Error("No user data");
}

// إظهار الواجهة
document.getElementById("app").style.display = "block";
document.getElementById("username").innerText = user.first_name;

// 🔐 إرسال auth للـ Backend
fetch("/api/auth", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    initData: tg.initData,
    device_id: tg.platform + "-" + navigator.userAgent
  })
})
.then(res => res.json())
.then(data => {
  if (data.error) {
    alert(data.error);
    tg.close();
  }
})
.catch(err => {
  console.error(err);
  tg.close();
});
