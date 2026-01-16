document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // تأكيد أننا داخل Telegram
    // =========================
    if (typeof Telegram === "undefined" || !Telegram.WebApp) {
        document.body.innerHTML = `
            <h2 style="color:red;margin-top:50px">
                ❌ افتح التطبيق من Telegram فقط
            </h2>
        `;
        return;
    }

    const tg = Telegram.WebApp;
    tg.ready();
    tg.expand();

    // =========================
    // قراءة بيانات المستخدم
    // =========================
    const data = tg.initDataUnsafe || {};
    const user = data.user || {};

    let displayName = "لاعب";

    if (user.first_name) {
        displayName = user.first_name;
    } else if (user.username) {
        displayName = user.username;
    } else if (user.id) {
        displayName = "ID " + user.id;
    }

    // =========================
    // عرض الاسم
    // =========================
    const el = document.getElementById("username");

    if (el) {
        el.innerText = displayName;
    } else {
        console.error("username element not found");
    }

});
