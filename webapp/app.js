(function () {

    // ============================
    // تأكد إننا داخل Telegram
    // ============================
    if (typeof Telegram === "undefined" || !Telegram.WebApp) {
        document.body.innerHTML = `
            <div style="color:red;text-align:center;margin-top:40px">
                ❌ افتح التطبيق من Telegram فقط
            </div>
        `;
        return;
    }

    const tg = Telegram.WebApp;
    tg.ready();
    tg.expand();

    // ============================
    // قراءة بيانات المستخدم
    // ============================
    const data = tg.initDataUnsafe || {};
    const user = data.user || {};

    // ============================
    // تحديد اسم آمن
    // ============================
    let displayName = "لاعب";

    if (user.first_name && user.first_name.length > 0) {
        displayName = user.first_name;
    } else if (user.username && user.username.length > 0) {
        displayName = user.username;
    } else if (user.id) {
        displayName = "ID " + user.id;
    }

    // ============================
    // عرض الاسم
    // ============================
    const usernameEl = document.getElementById("username");
    if (usernameEl) {
        usernameEl.innerText = `👤 ${displayName}`;
    }

})();
