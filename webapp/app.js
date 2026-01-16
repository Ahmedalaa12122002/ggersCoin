const tg = window.Telegram.WebApp;

tg.ready();

const user = tg.initDataUnsafe?.user;

if (!user) {
  document.body.innerHTML = "❌ الدخول مسموح من Telegram فقط";
} else {
  document.getElementById("username").innerText =
    "👤 " + (user.first_name || "لاعب");
}
