(function () {

    // ============================
    // تأكد إننا داخل Telegram
    // ============================
    if (typeof Telegram === "undefined" || !Telegram.WebApp) {
        document.body.innerHTML = `
            <div class="error">
                ❌ غير مسموح بالدخول<br>
                افتح التطبيق من Telegram فقط
            </div>
        `;
        return;
    }

    const tg = Telegram.WebApp;
    tg.ready();
    tg.expand();

    // ============================
    // التحقق من بيانات المستخدم
    // ============================
    const user = tg.initDataUnsafe?.user;

    if (!user) {
        document.body.innerHTML = `
            <div class="error">
                ❌ صلاحية غير صحيحة<br>
                أعد فتح التطبيق من Telegram
            </div>
        `;
        return;
    }

    // ============================
    // عرض اسم المستخدم
    // ============================
    const usernameEl = document.getElementById("username");

    const name =
        user.first_name ||
        user.username ||
        "لاعب";

    usernameEl.innerText = `👤 ${name}`;

    // ============================
    // (جاهز للخطوة القادمة)
    // إرسال auth للـ backend
    // ============================
    /*
    fetch("/api/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            initData: tg.initData,
            device_id: navigator.userAgent
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            document.body.innerHTML = `
                <div class="error">${data.error}</div>
            `;
        }
    });
    */

})();
