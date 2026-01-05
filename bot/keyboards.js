// bot/keyboards.js

function mainKeyboard(webAppUrl) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🐝 دخول تطبيق WinHive",
            web_app: {
              url: webAppUrl
            }
          }
        ]
      ]
    }
  };
}

module.exports = {
  mainKeyboard
};
