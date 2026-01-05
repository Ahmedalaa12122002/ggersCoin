function renderHome(){
  const content = document.getElementById("content");
  if(!content) return;

  content.innerHTML = `
    <div style="padding:20px;text-align:center">
      <h2>🏠 الرئيسية</h2>
      <p>هنا هتكون اللعبة</p>
    </div>
  `;
}
