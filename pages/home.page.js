/* =====================================================
   Home Page
   File: pages/home.page.js
   Responsibility:
   - Render Home Screen content ONLY
   - No navigation logic
   - No timers
   - No auto refresh
   - Stable base for future additions
===================================================== */

function renderHome() {
  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = `
    <style>
      .home-wrapper{
        padding:16px;
        padding-bottom:20px;
        max-width:480px;
        margin:0 auto;
      }

      /* ---------- Header ---------- */
      .home-header{
        text-align:center;
        margin-bottom:14px;
      }

      .home-header h2{
        margin:0;
        font-size:22px;
        color:#ffd54f;
      }

      .home-header p{
        margin-top:6px;
        font-size:13px;
        color:#aaa;
      }

      /* ---------- Stats ---------- */
      .home-stats{
        display:flex;
        gap:10px;
        margin-bottom:16px;
      }

      .stat-card{
        flex:1;
        background:#0f0f0f;
        border-radius:14px;
        padding:10px;
        text-align:center;
        box-shadow:inset 0 0 0 1px #1f1f1f;
      }

      .stat-card .value{
        font-size:18px;
        color:#ffd54f;
        font-weight:600;
      }

      .stat-card .label{
        font-size:11px;
        color:#888;
        margin-top:2px;
      }

      /* ---------- Game Box ---------- */
      .game-box{
        background:#111;
        border-radius:16px;
        height:320px;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#666;
        font-size:14px;
        box-shadow:
          inset 0 0 0 1px #222,
          0 6px 20px rgba(0,0,0,.4);
      }
    </style>

    <div class="home-wrapper">

      <div class="home-header">
        <h2>🌾 المزرعة</h2>
        <p>ازرع • انتظر • احصد</p>
      </div>

      <div class="home-stats">
        <div class="stat-card">
          <div class="value">0</div>
          <div class="label">النقاط</div>
        </div>
        <div class="stat-card">
          <div class="value">VIP 0</div>
          <div class="label">المستوى</div>
        </div>
      </div>

      <div class="game-box">
        مساحة اللعبة (سيتم تطويرها)
      </div>

    </div>
  `;
}
