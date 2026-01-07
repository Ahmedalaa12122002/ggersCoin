const tg = window.Telegram.WebApp;

tg.ready();

const user = tg.initDataUnsafe?.user;

if (user) {
  const authUser = {
    id: user.id,
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    username: user.username || "",
    language: user.language_code || "en"
  };

  localStorage.setItem("tg_user", JSON.stringify(authUser));
  console.log("Telegram User:", authUser);
} else {
  console.warn("Telegram user not found");
}
fetch("/api/auth", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(authUser)
});
