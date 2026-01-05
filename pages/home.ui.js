/* =====================================================
   Home UI
   File: pages/home/home.ui.js
   Responsibility:
   - Render Home UI (Farm only)
   - Pure UI (HTML + CSS)
   - No game logic
   - No timers
   - No state
===================================================== */

function renderHomeUI(containerId = "content") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <style>
      /* ===== Layout ===== */
      .home-ui-wrapper{
        max-width:480px;
        margin:0 auto;
        padding:16px;
      }

      .home-ui-header{
        text-align:center;
        margin-bottom:14px;
      }
      .home-ui-header h2{
        margin:0;
        font-size:22px;
        color:#ffd54f;
      }
      .home-ui-header p{
        margin-top:4px;
        font-size:13px;
        color:#aaa;
      }

      /* ===== Stats ===== */
      .home-ui-stats{
        display:flex;
        gap:10px;
        margin-bottom:14px;
      }
      .ui-stat{
        flex:1;
        background:#0f0f0f;
        border-radius:14px;
        padding:10px;
        text-align:center;
        box-shadow:inset 0 0 0 1px #1f1f1f;
      }
      .ui-stat .value{
        font-size:18px;
        color:#ffd54f;
        font-weight:600;
      }
      .ui-stat .label{
        font-size:11px;
        color:#888;
      }

      /* ===== Game Box ===== */
      .farm-ui-box{
        background:
          linear-gradient(#7cb342,#558b2f);
        border-radius:22px;
        padding:14px;
        box-shadow:
          inset 0 0 40px rgba(0,0,0,.35),
          0 8px 26px rgba(0,0,0,.55);
      }

      /* ===== Grid ===== */
      .farm-ui-grid{
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:12px;
      }

      /* ===== Plot ===== */
      .farm-ui-plot{
        position:relative;
        height:92px;
        border-radius:18px;
        background:
          radial-gradient(circle at top,#8d6e63,#4e342e);
        display:flex;
        align-items:center;
        justify-content:center;
        overflow:hidden;
        cursor:pointer;
        box-shadow:
          inset 0 4px 6px rgba(255,255,255,.08),
          inset 0 -6px 10px rgba(0,0,0,.6),
          0 6px 12px rgba(0,0,0,.45);
        transition:transform .15s ease, box-shadow .15s ease;
      }

      .farm-ui-plot:hover{
        transform:translateY(-2px);
        box-shadow:
          inset 0 4px 6px rgba(255,255,255,.1),
          inset 0 -6px 10px rgba(0,0,0,.6),
          0 10px 18px rgba(0,0,0,.55);
      }

      .farm-ui-plot:active{
        transform:scale(.95);
      }

      /* ===== Soil ===== */
      .farm-ui-soil{
        position:absolute;
        bottom:0;
        width:100%;
        height:38%;
        background:
          linear-gradient(#5d4037,#3e2723);
        border-radius:0 0 18px 18px;
        z-index:1;
      }

      /* ===== Plant Placeholder ===== */
      .farm-ui-plant{
        z-index:2;
        font-size:28px;
        animation:plantIdle 3s ease-in-out infinite alternate;
      }

      @keyframes plantIdle{
        from{ transform:scale(.96); }
        to{ transform:scale(1.05); }
      }
    </style>

    <div class="home-ui-wrapper">
      <div class="home-ui-header">
        <h2>🌾 المزرعة</h2>
        <p>ازرع • انتظر • احصد</p>
      </div>

      <div class="home-ui-stats">
        <div class="ui-stat">
          <div class="value">0</div>
          <div class="label">النقاط</div>
        </div>
        <div class="ui-stat">
          <div class="value">VIP 0</div>
          <div class="label">المستوى</div>
        </div>
      </div>

      <div class="farm-ui-box">
        <div class="farm-ui-grid">
          ${Array.from({length:12}).map(() => `
            <div class="farm-ui-plot">
              <div class="farm-ui-soil"></div>
              <div class="farm-ui-plant">🌱</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}
