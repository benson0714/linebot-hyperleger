// 引用 line bot SDK
let linebot = require('linebot');
const koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");

const app = new koa();
const router = Router();

// 初始化 line bot 需要的資訊，在 Heroku 上的設定的 Config Vars，可參考 Step2
let bot = linebot({
  channelId: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});


let msg;
let userData;
let dataAry = new Array();

app.use(bodyParser());

router.post('/webhooks', async (ctx, next) => {

});

// 當有人傳送訊息給 Bot 時
bot.on('message', function (event) {
  // 回覆訊息給使用者 (一問一答所以是回覆不是推送)
  msg = event.message.text;
  userData = event;
  dataAry.push({
    name:event.source.userId,
    text:event.message.text,
    time:new Date()
  });
  if(msg === "hi" || msg === "Hi") {
    event.reply({type:"text", text:"hello"});
  } else {
    event.reply({type:"text", text:`+u`})
  }
  });

app.use(router.routers);
const server = app.listen(process.env.PORT || 3000, () => {
  const port = server.address().port;
  console.log("App now running on port", port);
});