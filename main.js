Telegram.WebApp.ready();

const pages = {
  home: () => loadHome(),
  vip: () => loadVIP(),
  tasks: () => loadTasks(),
  referral: () => loadReferral(),
  wallet: () => loadWallet(),
  settings: () => loadSettings(),
  logs: () => loadLogs()
};

function go(page, el) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');

  const content = document.getElementById('content');
  content.style.opacity = 0;

  setTimeout(() => {
    content.innerHTML = '';
    if (pages[page]) {
      pages[page]();
    } else {
      content.innerHTML = '<p>الصفحة غير موجودة</p>';
    }
    content.style.opacity = 1;
  }, 150);
}

/* افتح الرئيسية أول ما التطبيق يشتغل */
window.onload = () => {
  go('home', document.querySelector('.home-btn'));
};
