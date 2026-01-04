<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WinHive</title>

<style>
body{
  margin:0;
  background:#000;
  color:#fff;
  font-family:Arial;
}

#content{
  min-height:80vh;
  padding:20px;
}

/* ===== NAV BAR ===== */
.nav{
  position:fixed;
  bottom:0;
  left:0;
  right:0;
  background:#0b0b0b;
  display:flex;
  justify-content:space-around;
  padding:10px 0;
  border-top:1px solid #222;
}

.nav button{
  background:none;
  border:none;
  color:#aaa;
  font-size:14px;
  padding:6px 10px;
  min-width:52px;
  cursor:pointer;
  transition:all .25s ease;
}

.nav button.active{
  color:#ffd54f;
  text-shadow:
    0 0 6px rgba(255,213,79,.8),
    0 0 12px rgba(255,213,79,.6);
  transform:translateY(-4px);
  font-size:15px;
}

.nav button:active{
  transform:scale(.9);
  filter:brightness(1.2);
}

/* ===== PAGE FADE ===== */
.fade{
  animation:fade .25s ease;
}

@keyframes fade{
  from{opacity:0;transform:translateY(10px)}
  to{opacity:1;transform:none}
}
</style>
</head>

<body>

<div id="content">⌛ جاري التحميل...</div>

<div class="nav">
  <button data-page="settings" onclick="goPage('settings')">⚙️<br>الإعدادات</button>
  <button data-page="vip" onclick="goPage('vip')">👑<br>VIP</button>
  <button data-page="wallet" onclick="goPage('wallet')">💼<br>المحفظة</button>
  <button data-page="home" class="active" onclick="goPage('home')">🏠<br>الرئيسية</button>
  <button data-page="tasks" onclick="goPage('tasks')">📋<br>المهام</button>
  <button data-page="ref" onclick="goPage('ref')">👥<br>الإحالة</button>
  <button data-page="logs" onclick="goPage('logs')">🧾<br>السجلات</button>
</div>

<script src="core/navigation.js"></script>
<script src="main.js"></script>
<script src="pages/home.page.js"></script>

</body>
</html>
