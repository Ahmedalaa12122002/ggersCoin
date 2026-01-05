/* ===============================
   Bottom Navigation (7 Tabs)
================================ */

function renderBottomNav(){
  if(document.getElementById("bottom-nav")) return;

  document.body.insertAdjacentHTML("beforeend",`
    <style>
      #bottom-nav{
        position:fixed;
        bottom:0;
        left:0;
        right:0;
        height:90px;
        background:#0c0c0c;
        display:flex;
        justify-content:space-around;
        align-items:center;
        border-top:1px solid #222;
        z-index:999;
      }
      .nav-btn{
        flex:1;
        text-align:center;
        color:#777;
        font-size:12px;
        cursor:pointer;
        transition:.25s;
      }
      .nav-btn .icon{
        font-size:22px;
        display:block;
      }
      .nav-btn.active{
        color:#ffd54f;
        text-shadow:0 0 10px rgba(255,213,79,.6);
      }
    </style>

    <div id="bottom-nav">
      ${[
        ["settings","⚙️","الإعدادات"],
        ["vip","⭐","VIP"],
        ["wallet","💼","المحفظة"],
        ["home","🏠","الرئيسية"],
        ["tasks","📋","المهام"],
        ["ref","👥","الإحالة"],
        ["logs","🧾","السجلات"],
      ].map(i=>`
        <div class="nav-btn" data-page="${i[0]}">
          <span class="icon">${i[1]}</span>${i[2]}
        </div>
      `).join("")}
    </div>
  `);

  document.querySelectorAll(".nav-btn").forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      switchPage(btn.dataset.page);
    };
  });
       }
