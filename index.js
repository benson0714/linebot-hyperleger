// 引用 line bot SDK
let linebot = require('linebot');
// const express = require('express');
// const middleware = require('@line/bot-sdk').middleware;
// const JSONParseError = require('@line/bot-sdk').JSONParseError;
// const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed;

const app = express();

// 初始化 line bot 需要的資訊，在 Heroku 上的設定的 Config Vars
let bot = linebot({
  channelId: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

// 當有人傳送訊息給 Bot 時
bot.on('message', function (event) {
  // 回覆訊息給使用者 (一問一答所以是回覆不是推送)
  event.reply(`你說了 ${event.message.text}`);
});

// Bot 所監聽的 webhook 路徑與 port，heroku 會動態存取 port 所以不能用固定的 port，沒有的話用預設的 port 5000
bot.listen('/', process.env.PORT || 8080, function () {
  console.log('全國首家LINE線上機器人上線啦！！');
});

