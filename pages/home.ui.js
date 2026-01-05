/* ===============================
   Home UI (Farm)
================================ */

function renderHomeUI(id){
  const c=document.getElementById(id);
  if(!c) return;

  c.innerHTML=`
    <style>
      .farm{
        max-width:480px;
        margin:20px auto;
        padding:16px;
        background:linear-gradient(#7cb342,#558b2f);
        border-radius:20px;
      }
      .grid{
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:12px;
      }
      .plot{
        height:90px;
        border-radius:16px;
        background:radial-gradient(#8d6e63,#4e342e);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:28px;
        animation:pulse 3s infinite alternate;
      }
      @keyframes pulse{
        from{transform:scale(.96)}
        to{transform:scale(1.04)}
      }
    </style>

    <h2 style="text-align:center;color:#ffd54f">🌾 المزرعة</h2>
    <div class="farm">
      <div class="grid">
        ${Array.from({length:12}).map(()=>`<div class="plot">🌱</div>`).join("")}
      </div>
    </div>
  `;
}
