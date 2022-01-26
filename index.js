const koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const rq = require('request-promise');
const logger = require('koa-logger')
global.crypto = require('crypto');

const app = new koa();
const router = Router();

app.use(bodyParser());
app.use(logger());

app.use(router.routes());

let lineBotToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const channelSecret = process.env.LINE_CHANNEL_SECRET;

router.post('/webhooks', async (ctx) => {
  let events = ctx.request.body.events;
    let responseText = (events, lineBotToken) => {
      let message = events.message.text;
      let replyToken = events.replyToken;
      let options = {
        method: 'POST',
        uri: 'https://api.line.me/v2/bot/message/reply',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${lineBotToken}`,
        },
        body: {
            replyToken: replyToken,
            messages: [{
                type: "text",
                text: message
            }],
        },
        json: true
    };
    return(request(options));
  }
  data = await responseText(events, lineBotToken);
  ctx.body = data;
});

app.use((ctx) => {
  ctx.status = 200;
})

const server = app.listen(process.env.PORT || 3000, () => {
  const port = server.address().port;
  console.log("App now running on port", port);
});