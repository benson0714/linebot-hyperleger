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

lineBotToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

let msg;
let userData;
let dataAry = new Array();

app.use(bodyParser());

responseText = (events, lineBotToken, resObject) => {
    let message = events[0].message.text;
    let replyToken = events[0].replyToken;
    let options = {
        method: 'POST',
        uri: 'https://api.line.me/v2/bot/message/reply',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${lineBotToken}`
        },
        body: {
            replyToken: replyToken,
            messages: [{
                type: "text",
                text: resObject[message]
            }]
        },
        json: true
    }
    return request(options);
  }

router.post('/webhooks', async (ctx, next) => {
    let events = ctx.request.body.events;
    data = await responseText(events, lineBotToken, {
        '哈囉': '你好阿',
        '晚安': '晚安'
    });
    ctx.body = data;
});

app.use(router.routes());
const server = app.listen(process.env.PORT || 3000, () => {
  const port = server.address().port;
  console.log("App now running on port", port);
  console.log(lineBotToken);
});